import {
  CtaButton,
  colors,
  Icon,
  ImageUpload,
  SecretToggle,
  TextInput
} from '@comma/design-system';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { type ChangeEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appBridge } from '../bridge';
import * as styles from './RestActivity.css';

const REST_TITLE = '가볍게 산책하기';
const REST_DESCRIPTION = '동네 한바퀴하면서 예쁜 하늘 사진 한장 어떠세요?';
const ACTIVITY_PROGRESS_TITLE = '산책하고 사진 찍는중..';
const ACTIVITY_PROGRESS_COUNT = '173';
const COMMENT_MAX_LENGTH = 20;
const TAG_MAX_LENGTH = 12;
const PHOTO_PICKER_IMAGES = [
  { id: 'rest-1', src: '/images/rest_1.svg' },
  { id: 'rest-2', src: '/images/rest_2.svg' },
  { id: 'home', src: '/images/Home.png' },
  { id: 'rest-5', src: '/images/rest_5.svg' },
  { id: 'rest-1-repeat', src: '/images/rest_1.svg' }
];
const EMPTY_PHOTO_TILES = ['empty-1', 'empty-2', 'empty-3', 'empty-4', 'empty-5', 'empty-6'];

type GalleryPhotoItem = {
  id: string;
  src: string;
};

function normalizeTag(value: string) {
  return value.replace(/^#+\s*/, '').trim();
}

function isObjectUrl(value?: string) {
  return value?.startsWith('blob:') ?? false;
}

function ReselectModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className={styles.modalOverlay}>
      <section
        aria-labelledby="rest-activity-modal-title"
        aria-modal="true"
        className={styles.modal}
        role="dialog"
      >
        <div className={styles.modalHeader}>
          <button aria-label="닫기" className={styles.iconButton} onClick={onCancel} type="button">
            <Icon color={colors.iconPrimary} name="x" />
          </button>
        </div>
        <div className={styles.modalText}>
          <h2 className={styles.modalTitle} id="rest-activity-modal-title">
            휴식 재선택
          </h2>
          <p className={styles.modalDescription}>휴식을 다시 선택할까요?</p>
        </div>
        <div className={styles.modalActions}>
          <CtaButton className={styles.cancelButton} onClick={onCancel}>
            취소
          </CtaButton>
          <CtaButton className={styles.confirmButton} onClick={onConfirm}>
            확인
          </CtaButton>
        </div>
      </section>
    </div>
  );
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
      <main className={styles.page}>
        <div
          className={styles.screen}
          style={assignInlineVars({
            [styles.backgroundImageVar]: 'url(/images/rest_activity_progress.jpg)'
          })}
        >
          <div
            aria-hidden="true"
            className={[styles.dimOverlay, styles.dimOverlayVisible].join(' ')}
          />
          <div aria-hidden="true" className={styles.topGradient} />
          <div aria-hidden="true" className={styles.bottomGradient} />

          <header className={styles.progressHeader}>
            <button
              aria-label="휴식 재선택"
              className={styles.iconButton}
              onClick={() => setShowReselectModal(true)}
              type="button"
            >
              <Icon color={colors.iconPrimary} name="x" />
            </button>
          </header>

          <section
            className={styles.progressContent}
            aria-labelledby="rest-activity-progress-title"
          >
            <div className={styles.progressHeroText}>
              <h1 className={styles.title} id="rest-activity-progress-title">
                {ACTIVITY_PROGRESS_TITLE}
              </h1>
              <p className={styles.description}>{REST_DESCRIPTION}</p>
            </div>

            <div className={styles.participantRow}>
              <span className={styles.participantCount}>{ACTIVITY_PROGRESS_COUNT}</span>
              <span className={styles.participantLabel}>명이 함께하는 중</span>
            </div>
          </section>

          <footer className={styles.progressFooter}>
            <CtaButton className={styles.doneButton} onClick={() => setIsWritingStarted(true)}>
              휴식 완료
            </CtaButton>
          </footer>

          {showReselectModal ? (
            <ReselectModal
              onCancel={() => setShowReselectModal(false)}
              onConfirm={() => navigate('/rest/checklist')}
            />
          ) : null}
        </div>
      </main>
    );
  }

  if (showPhotoPicker) {
    return (
      <main className={styles.page}>
        <div className={styles.photoPickerScreen}>
          <div aria-hidden="true" className={styles.topGradient} />
          <div aria-hidden="true" className={styles.bottomGradient} />

          <header className={styles.photoPickerHeader}>
            <button
              aria-label="사진 선택 닫기"
              className={styles.iconButton}
              onClick={() => setShowPhotoPicker(false)}
              type="button"
            >
              <Icon color={colors.iconPrimary} name="backArrow" />
            </button>
          </header>

          <section className={styles.photoPickerContent} aria-label="사진 선택">
            <ImageUpload
              className={styles.upload}
              onClick={() => fileInputRef.current?.click()}
              state="select"
            />
          </section>

          <div className={styles.photoGrid}>
            <button
              aria-label="카메라로 사진 선택"
              className={styles.cameraTile}
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              <Icon color={colors.iconPrimary} height={40} name="camera" width={40} />
            </button>
            {photoPickerItems.map((photo) => (
              <button
                aria-label="사진 선택"
                className={styles.photoTile}
                key={photo.id}
                onClick={() => handlePhotoSelect(photo.src)}
                type="button"
              >
                <img alt="" className={styles.photoTileImage} src={photo.src} />
              </button>
            ))}
            {EMPTY_PHOTO_TILES.map((tile) => (
              <div className={styles.emptyPhotoTile} key={tile} />
            ))}
          </div>

          <input
            ref={fileInputRef}
            accept="image/*"
            className={styles.hiddenInput}
            onChange={handleImageChange}
            type="file"
          />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div
        className={styles.screen}
        style={
          imagePreview
            ? assignInlineVars({
                [styles.backgroundImageVar]: `url(${imagePreview})`
              })
            : undefined
        }
      >
        <div
          aria-hidden="true"
          className={[styles.dimOverlay, imagePreview ? styles.dimOverlayVisible : undefined]
            .filter(Boolean)
            .join(' ')}
        />
        <div aria-hidden="true" className={styles.topGradient} />
        <div aria-hidden="true" className={styles.bottomGradient} />

        <header className={styles.header}>
          <button
            aria-label="휴식 재선택"
            className={styles.iconButton}
            onClick={() => setShowReselectModal(true)}
            type="button"
          >
            <Icon color={colors.iconPrimary} name="x" />
          </button>
        </header>

        <section className={styles.content} aria-labelledby="rest-activity-title">
          <div className={styles.heroText}>
            <h1 className={styles.title} id="rest-activity-title">
              {REST_TITLE}
            </h1>
            <p className={styles.description}>{REST_DESCRIPTION}</p>
          </div>

          <div className={styles.uploadArea}>
            <ImageUpload
              className={styles.upload}
              imageAlt="업로드한 휴식 사진"
              imageSrc={imagePreview}
              onClick={() => setShowPhotoPicker(true)}
              state={imagePreview ? 'exist' : 'none'}
            />
            <input
              ref={fileInputRef}
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handleImageChange}
              type="file"
            />
          </div>

          <div className={styles.formStack}>
            <div className={styles.tagSection}>
              <TextInput
                className={styles.input}
                maxLength={TAG_MAX_LENGTH}
                onBlur={() => setFocusedInput(undefined)}
                onChange={setTagInput}
                onFocus={() => setFocusedInput('tag')}
                onKeyDown={handleTagKeyDown}
                onPlusClick={handleAddTag}
                placeholder="예) 한강, 힐링"
                state={tagInputState}
                title="해시태그 추가"
                value={tagInput}
                variant="field"
              />
              {tags.length > 0 ? (
                <div className={styles.tagList}>
                  {tags.map((tag) => (
                    <span className={styles.tag} key={tag}>
                      # {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <TextInput
              className={styles.input}
              enforceMaxLength={false}
              helperText={comment.length > 0 ? '최대 20자까지 입력할 수 있어요' : undefined}
              helperTone={isCommentOverLimit ? 'error' : 'default'}
              maxLength={COMMENT_MAX_LENGTH}
              onBlur={() => setFocusedInput(undefined)}
              onChange={setComment}
              onFocus={() => setFocusedInput('comment')}
              placeholder="예) 오랜만에 바람 쐬니 좋네요"
              showFooter={comment.length > 0}
              state={commentState}
              title="한 줄 소감"
              value={comment}
              variant="field"
            />
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.visibilityRow}>
            <span className={styles.visibilityLabel}>공개 여부</span>
            <SecretToggle checked={isSecret} onCheckedChange={setIsSecret} />
          </div>
          <CtaButton
            className={styles.doneButton}
            disabled={!isComplete}
            onClick={() => navigate('/recommend-result')}
          >
            휴식 완료
          </CtaButton>
        </footer>

        {showReselectModal ? (
          <ReselectModal
            onCancel={() => setShowReselectModal(false)}
            onConfirm={() => navigate('/rest/checklist')}
          />
        ) : null}
      </div>
    </main>
  );
}

export default RestActivity;
