import { type ChangeEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appBridge } from '../../bridge';
import { COMMENT_MAX_LENGTH, PHOTO_PICKER_IMAGES } from './RestActivity.constants';
import { RestActivityForm } from './RestActivityForm';
import { type GalleryPhotoItem, RestActivityPhotoPicker } from './RestActivityPhotoPicker';
import { RestActivityProgress } from './RestActivityProgress';

function normalizeTag(value: string) {
  return value.replace(/^#+\s*/, '').trim();
}

function isObjectUrl(value?: string) {
  return value?.startsWith('blob:') ?? false;
}

function RestActivity() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showReselectModal, setShowReselectModal] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [isWritingStarted, setIsWritingStarted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>();
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoItem[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [focusedInput, setFocusedInput] = useState<'tag' | 'comment'>();
  const [isSecret, setIsSecret] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview && isObjectUrl(imagePreview)) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!showPhotoPicker) return;

    let isActive = true;

    appBridge
      .getGalleryPhotos(30)
      .then((photos) => {
        if (!isActive) return;

        setGalleryPhotos(
          photos.map((photo) => ({
            id: photo.id,
            src: photo.uri
          }))
        );
      })
      .catch((error) => {
        console.warn('Failed to load gallery photos.', error);
        if (isActive) {
          setGalleryPhotos([]);
        }
      });

    return () => {
      isActive = false;
    };
  }, [showPhotoPicker]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    const nextPreview = URL.createObjectURL(file);
    setImagePreview((currentPreview) => {
      if (currentPreview && isObjectUrl(currentPreview)) {
        URL.revokeObjectURL(currentPreview);
      }

      return nextPreview;
    });
    setShowPhotoPicker(false);
    event.currentTarget.value = '';
  };

  const handlePhotoSelect = (src: string) => {
    setImagePreview((currentPreview) => {
      if (currentPreview && isObjectUrl(currentPreview)) {
        URL.revokeObjectURL(currentPreview);
      }

      return src;
    });
    setShowPhotoPicker(false);
  };

  const handleAddTag = () => {
    const nextTag = normalizeTag(tagInput);

    if (!nextTag || tags.includes(nextTag)) return;

    setTags((currentTags) => [...currentTags, nextTag]);
    setTagInput('');
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    handleAddTag();
  };

  const handleConfirmReselect = () => navigate('/rest/checklist');
  const handleComplete = () => navigate('/recommend-result');
  const tagInputState =
    focusedInput === 'tag'
      ? tagInput.length > 0
        ? 'type'
        : 'focus'
      : tagInput.length > 0
        ? 'filledPlus'
        : 'default';
  const isCommentOverLimit = comment.length > COMMENT_MAX_LENGTH;
  const commentState = isCommentOverLimit
    ? 'filled'
    : focusedInput === 'comment'
      ? 'type'
      : comment.length > 0
        ? 'filled'
        : 'default';
  const isComplete =
    Boolean(imagePreview) && tags.length > 0 && comment.trim().length > 0 && !isCommentOverLimit;
  const photoPickerItems = galleryPhotos.length > 0 ? galleryPhotos : PHOTO_PICKER_IMAGES;

  if (!isWritingStarted) {
    return (
      <RestActivityProgress
        showReselectModal={showReselectModal}
        onCancelReselect={() => setShowReselectModal(false)}
        onComplete={() => setIsWritingStarted(true)}
        onConfirmReselect={handleConfirmReselect}
        onOpenReselectModal={() => setShowReselectModal(true)}
      />
    );
  }

  if (showPhotoPicker) {
    return (
      <RestActivityPhotoPicker
        fileInputRef={fileInputRef}
        photos={photoPickerItems}
        onClose={() => setShowPhotoPicker(false)}
        onImageChange={handleImageChange}
        onPhotoSelect={handlePhotoSelect}
      />
    );
  }

  return (
    <RestActivityForm
      comment={comment}
      commentState={commentState}
      imagePreview={imagePreview}
      isCommentOverLimit={isCommentOverLimit}
      isComplete={isComplete}
      isSecret={isSecret}
      showReselectModal={showReselectModal}
      tagInput={tagInput}
      tagInputState={tagInputState}
      tags={tags}
      onAddTag={handleAddTag}
      onCancelReselect={() => setShowReselectModal(false)}
      onCommentBlur={() => setFocusedInput(undefined)}
      onCommentChange={setComment}
      onCommentFocus={() => setFocusedInput('comment')}
      onComplete={handleComplete}
      onConfirmReselect={handleConfirmReselect}
      onOpenPhotoPicker={() => setShowPhotoPicker(true)}
      onOpenReselectModal={() => setShowReselectModal(true)}
      onSecretChange={setIsSecret}
      onTagInputBlur={() => setFocusedInput(undefined)}
      onTagInputChange={setTagInput}
      onTagInputFocus={() => setFocusedInput('tag')}
      onTagKeyDown={handleTagKeyDown}
    />
  );
}

export default RestActivity;
