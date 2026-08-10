import { type FeedCreateRequest, NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR } from '@comma/bridge';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { expireSession } from '../../../shared/api/client';
import { appBridge } from '../../../shared/bridge/bridge';
import { useAppToast } from '../../../shared/components/AppToast';
import { useNativeBackHandler } from '../../../shared/components/NativeBack';
import { createFeed } from '../../feed/api/feed.api';
import type { RestLoadingLocationState } from '../model/relax.types';
import { ACTIVITY_PROGRESS_COUNT } from '../model/restActivity.constants';
import { type RestActivityDraft, RestActivityForm } from './RestActivityForm';
import { RestActivityPhotoPicker, type SelectedActivityPhoto } from './RestActivityPhotoPicker';
import { RestActivityProgress } from './RestActivityProgress';

function isObjectUrl(value?: string) {
  return value?.startsWith('blob:') ?? false;
}

function isNativeUploadUnauthorizedError(error: unknown) {
  return error instanceof Error && error.message.includes(NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR);
}

function RestActivityScreen() {
  const navigate = useNavigate();
  const { showToast } = useAppToast();
  const location = useLocation();
  const locationState = location.state as RestLoadingLocationState | null;
  const activityId = locationState?.selectedRelax?.activityId;
  const hasValidLocationState = Boolean(
    locationState?.mood &&
      locationState.timeBudget &&
      locationState.selectedRelax &&
      typeof activityId === 'number'
  );
  const invalidStateHandledRef = useRef(false);
  const participantCount = locationState?.selectedRelax?.activeUserCount ?? ACTIVITY_PROGRESS_COUNT;
  const [showReselectModal, setShowReselectModal] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [isWritingStarted, setIsWritingStarted] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<SelectedActivityPhoto>();
  const [draft, setDraft] = useState<RestActivityDraft>({
    tagInput: '',
    tags: [],
    comment: '',
    isSecret: false
  });
  const uploadMutation = useMutation({
    mutationFn: async ({
      photo,
      request
    }: {
      photo: Exclude<SelectedActivityPhoto, { kind: 'preview' }>;
      request: FeedCreateRequest;
    }) => {
      if (photo.kind === 'file') {
        const response = await createFeed(photo.file, request);
        if (!response.success) {
          throw new Error(response.message ?? '피드 업로드에 실패했어요.');
        }
        return;
      }

      await appBridge.createFeedWithGalleryPhoto(photo.photo, request);
    }
  });

  useNativeBackHandler(() => {
    if (uploadMutation.isPending) {
      showToast('업로드 중이에요.');
      return true;
    }
    if (showPhotoPicker) {
      setShowPhotoPicker(false);
      return true;
    }
    if (showReselectModal) {
      setShowReselectModal(false);
      return true;
    }
    if (isWritingStarted) {
      setIsWritingStarted(false);
      return true;
    }

    setShowReselectModal(true);
    return true;
  });

  useEffect(() => {
    if (hasValidLocationState || invalidStateHandledRef.current) return;

    invalidStateHandledRef.current = true;
    showToast('휴식 정보가 없어 다시 선택해주세요.');
    navigate('/rest/checklist', { replace: true });
  }, [hasValidLocationState, navigate, showToast]);

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

  const handleConfirmReselect = () => navigate('/rest/checklist', { replace: true });

  const handleComplete = async (values: {
    hashtags: string[];
    review: string;
    isPublic: boolean;
  }) => {
    if (!locationState?.mood || !locationState.timeBudget || typeof activityId !== 'number') {
      showToast('휴식 정보가 없어 다시 선택해주세요.');
      navigate('/rest/checklist', { replace: true });
      return;
    }

    if (!selectedPhoto) {
      showToast('업로드할 사진을 선택해주세요.');
      return;
    }

    if (selectedPhoto.kind === 'preview') {
      showToast('기본 예시 이미지는 업로드할 수 없어요. 앨범이나 파일에서 사진을 선택해주세요.');
      return;
    }

    const request: FeedCreateRequest = {
      mood: locationState.mood,
      timeBudget: locationState.timeBudget,
      hashtags: values.hashtags,
      review: values.review,
      isPublic: values.isPublic,
      activityId
    };

    try {
      await uploadMutation.mutateAsync({ photo: selectedPhoto, request });

      navigate('/feed', { replace: true });
    } catch (error) {
      if (isNativeUploadUnauthorizedError(error)) {
        await expireSession();
        return;
      }

      console.error('Failed to create feed.', error);
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
      isSubmitting={uploadMutation.isPending}
      submissionError={uploadMutation.error?.message}
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

export default RestActivityScreen;
