import { type FeedCreateRequest, NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR } from '@comma/bridge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getAnalyticsFailureReason,
  toRelaxCode,
  trackEvent
} from '../../../shared/analytics/events';
import { expireSession } from '../../../shared/api/client';
import { appBridge } from '../../../shared/bridge/bridge';
import { useAppToast } from '../../../shared/components/AppToast';
import { useNativeBackHandler } from '../../../shared/components/NativeBack';
import { isNativeApp } from '../../../shared/lib/tokenStorage';
import { userQueryKeys } from '../../auth/api/user.queries';
import { createFeed } from '../../feed/api/feed.api';
import { clearStoredActivityId, getStoredActivityId } from '../lib/activityStorage';
import { MAX_UPLOAD_FILE_SIZE, readFileAsBase64 } from '../lib/photoFile';
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

async function createFeedWithFilePhoto(file: File, request: FeedCreateRequest) {
  if (!isNativeApp()) {
    const response = await createFeed(file, request);
    if (!response.success) {
      throw new Error(response.message ?? '피드 업로드에 실패했어요.');
    }
    return;
  }

  if (file.size > MAX_UPLOAD_FILE_SIZE) {
    throw new Error('15MB 이하의 사진을 선택해 주세요.');
  }

  const preparedPhoto = await appBridge.prepareFilePhoto({
    base64: await readFileAsBase64(file),
    filename: file.name,
    mimeType: file.type || undefined
  });

  try {
    await appBridge.createFeedWithGalleryPhoto(preparedPhoto, request);
  } finally {
    await appBridge.deletePreparedGalleryPhoto(preparedPhoto.uri).catch(() => {});
  }
}

function RestActivityScreen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useAppToast();
  const location = useLocation();
  const locationState = location.state as RestLoadingLocationState | null;
  const selectedRelax = locationState?.selectedRelax;
  const relaxCode = selectedRelax ? toRelaxCode(selectedRelax.id) : undefined;
  const activityId = selectedRelax?.activityId ?? getStoredActivityId();
  const hasValidLocationState = Boolean(
    locationState?.mood &&
      locationState.timeBudget &&
      selectedRelax &&
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
        await createFeedWithFilePhoto(photo.file, request);
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
      trackEvent('reselection_cancelled', {
        stage: isWritingStarted ? 'record' : 'activity'
      });
      setShowReselectModal(false);
      return true;
    }
    if (isWritingStarted) {
      setIsWritingStarted(false);
      return true;
    }

    trackEvent('reselection_opened', { stage: 'activity' });
    setShowReselectModal(true);
    return true;
  });

  useEffect(() => {
    if (hasValidLocationState || invalidStateHandledRef.current) return;

    invalidStateHandledRef.current = true;
    trackEvent('rest_state_invalid', {
      failure_reason: 'invalid_state',
      stage: 'activity'
    });
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
    trackEvent('photo_selected', { photo_source: photo.kind });
    setSelectedPhoto(photo);
    setShowPhotoPicker(false);
  };

  const handleOpenReselect = () => {
    if (!showReselectModal) {
      trackEvent('reselection_opened', {
        stage: isWritingStarted ? 'record' : 'activity'
      });
    }
    setShowReselectModal(true);
  };

  const handleCancelReselect = () => {
    trackEvent('reselection_cancelled', {
      stage: isWritingStarted ? 'record' : 'activity'
    });
    setShowReselectModal(false);
  };

  const handleConfirmReselect = () => {
    trackEvent('reselection_confirmed', {
      stage: isWritingStarted ? 'record' : 'activity'
    });
    navigate('/rest/checklist', { replace: true });
  };

  const handleOpenPhotoPicker = () => {
    trackEvent('photo_picker_opened');
    setShowPhotoPicker(true);
  };

  const handleComplete = async (values: {
    hashtags: string[];
    review: string;
    isPublic: boolean;
  }) => {
    if (
      !locationState?.mood ||
      !locationState.timeBudget ||
      !selectedRelax ||
      !relaxCode ||
      typeof activityId !== 'number'
    ) {
      trackEvent('rest_state_invalid', {
        failure_reason: 'invalid_state',
        stage: 'record'
      });
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
      trackEvent('rest_record_submitted', {
        is_public: values.isPublic,
        photo_source: selectedPhoto.kind,
        relax_code: relaxCode,
        tag_count: values.hashtags.length
      });
      await uploadMutation.mutateAsync({ photo: selectedPhoto, request });

      clearStoredActivityId();
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.restStatus() });
      trackEvent('rest_completed', { is_public: values.isPublic, relax_code: relaxCode });
      navigate('/feed', { replace: true });
    } catch (error) {
      trackEvent('rest_completion_failed', {
        failure_reason: getAnalyticsFailureReason(error),
        relax_code: relaxCode,
        stage: isNativeUploadUnauthorizedError(error) ? 'authorization' : 'upload'
      });
      if (isNativeUploadUnauthorizedError(error)) {
        await expireSession();
        return;
      }

      console.error('Failed to create feed.', error);
    }
  };

  if (!hasValidLocationState || !relaxCode) return null;

  if (!isWritingStarted) {
    return (
      <RestActivityProgress
        participantCount={participantCount}
        showReselectModal={showReselectModal}
        onCancelReselect={handleCancelReselect}
        onComplete={() => {
          trackEvent('rest_record_started', {
            relax_code: relaxCode
          });
          setIsWritingStarted(true);
        }}
        onConfirmReselect={handleConfirmReselect}
        onOpenReselectModal={handleOpenReselect}
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
      onCancelReselect={handleCancelReselect}
      onComplete={handleComplete}
      onConfirmReselect={handleConfirmReselect}
      onDraftChange={setDraft}
      onOpenPhotoPicker={handleOpenPhotoPicker}
      onOpenReselectModal={handleOpenReselect}
      title={
        locationState?.selectedRelax?.activeMessage ?? locationState?.selectedRelax?.name ?? ''
      }
    />
  );
}

export default RestActivityScreen;
