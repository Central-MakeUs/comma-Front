import {
  type FeedCreateRequest,
  NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR,
  type PreparedGalleryPhoto
} from '@comma/bridge';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { expireSession } from '../../apis/client';
import { createFeed } from '../../apis/feed';
import { appBridge } from '../../bridge';
import type { RestLoadingLocationState } from '../../types/relax';
import { ACTIVITY_PROGRESS_COUNT } from './RestActivity.constants';
import { type RestActivityDraft, RestActivityForm } from './RestActivityForm';
import { RestActivityPhotoPicker, type SelectedActivityPhoto } from './RestActivityPhotoPicker';
import { RestActivityProgress } from './RestActivityProgress';

function isObjectUrl(value?: string) {
  return value?.startsWith('blob:') ?? false;
}

function isNativeUploadUnauthorizedError(error: unknown) {
  return error instanceof Error && error.message.includes(NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR);
}

function RestActivity() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as RestLoadingLocationState | null;
  const hasValidLocationState = Boolean(
    locationState?.mood && locationState.timeBudget && locationState.selectedRelax
  );
  const invalidStateHandledRef = useRef(false);
  const participantCount = locationState?.selectedRelax?.activeUserCount ?? ACTIVITY_PROGRESS_COUNT;
  const [showReselectModal, setShowReselectModal] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [isWritingStarted, setIsWritingStarted] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<SelectedActivityPhoto>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draft, setDraft] = useState<RestActivityDraft>({
    tagInput: '',
    tags: [],
    comment: '',
    isSecret: false
  });

  useEffect(() => {
    if (hasValidLocationState || invalidStateHandledRef.current) return;

    invalidStateHandledRef.current = true;
    alert('휴식 정보가 없어 다시 선택해주세요.');
    navigate('/rest/checklist', { replace: true });
  }, [hasValidLocationState, navigate]);

  useEffect(() => {
    return () => {
      if (selectedPhoto?.kind === 'file' && isObjectUrl(selectedPhoto.previewSrc)) {
        URL.revokeObjectURL(selectedPhoto.previewSrc);
      }

      if (selectedPhoto?.kind === 'native') {
        void appBridge.deletePreparedGalleryPhoto(selectedPhoto.photo.uri).catch(() => {});
      }
    };
  }, [selectedPhoto]);

  const imagePreview = selectedPhoto?.previewSrc;

  const handlePhotoSelect = (photo: SelectedActivityPhoto) => {
    setSelectedPhoto(photo);
    setShowPhotoPicker(false);
  };

  const handleConfirmReselect = () => navigate('/rest/checklist');

  const createFeedWithNativePhoto = async (
    photo: PreparedGalleryPhoto,
    request: FeedCreateRequest
  ) => appBridge.createFeedWithGalleryPhoto(photo, request);

  const handleComplete = async (values: {
    hashtags: string[];
    review: string;
    isPublic: boolean;
  }) => {
    if (!locationState?.mood || !locationState.timeBudget) {
      alert('휴식 정보가 없어 다시 선택해주세요.');
      navigate('/rest/checklist', { replace: true });
      return;
    }

    if (!selectedPhoto) {
      alert('업로드할 사진을 선택해주세요.');
      return;
    }

    if (selectedPhoto.kind === 'preview') {
      alert('기본 예시 이미지는 업로드할 수 없어요. 앨범이나 파일에서 사진을 선택해주세요.');
      return;
    }

    const request: FeedCreateRequest = {
      mood: locationState.mood,
      timeBudget: locationState.timeBudget,
      hashtags: values.hashtags,
      review: values.review,
      isPublic: values.isPublic
    };

    setIsSubmitting(true);

    try {
      if (selectedPhoto.kind === 'file') {
        const response = await createFeed(selectedPhoto.file, request);

        if (!response.success) {
          throw new Error(response.message ?? '피드 업로드에 실패했어요.');
        }
      } else {
        await createFeedWithNativePhoto(selectedPhoto.photo, request);
      }

      navigate('/feed');
    } catch (error) {
      if (isNativeUploadUnauthorizedError(error)) {
        await expireSession();
        return;
      }

      console.error('Failed to create feed.', error);
      alert(error instanceof Error ? error.message : '피드 업로드에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasValidLocationState) return null;

  if (!isWritingStarted) {
    return (
      <RestActivityProgress
        participantCount={participantCount}
        showReselectModal={showReselectModal}
        onCancelReselect={() => setShowReselectModal(false)}
        onComplete={() => setIsWritingStarted(true)}
        onConfirmReselect={handleConfirmReselect}
        onOpenReselectModal={() => setShowReselectModal(true)}
        title={locationState?.selectedRelax?.activeMessage}
        desc={locationState?.selectedRelax?.description}
        imageSrc={locationState?.selectedRelax?.imageUrl}
      />
    );
  }

  if (showPhotoPicker) {
    return (
      <RestActivityPhotoPicker
        onClose={() => setShowPhotoPicker(false)}
        onPhotoSelect={handlePhotoSelect}
      />
    );
  }

  return (
    <RestActivityForm
      draft={draft}
      desc={locationState?.selectedRelax?.description ?? ''}
      imagePreview={imagePreview}
      isSubmitting={isSubmitting}
      showReselectModal={showReselectModal}
      onCancelReselect={() => setShowReselectModal(false)}
      onComplete={handleComplete}
      onConfirmReselect={handleConfirmReselect}
      onDraftChange={setDraft}
      onOpenPhotoPicker={() => setShowPhotoPicker(true)}
      onOpenReselectModal={() => setShowReselectModal(true)}
      title={
        locationState?.selectedRelax?.activeMessage ?? locationState?.selectedRelax?.name ?? ''
      }
    />
  );
}

export default RestActivity;
