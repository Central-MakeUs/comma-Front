import { type FeedCreateRequest, NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR } from '@comma/bridge';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { refreshStoredTokens } from '../../apis/client';
import { createFeed } from '../../apis/feed';
import { appBridge } from '../../bridge';
import type { RestLoadingLocationState } from '../../types/relax';
import { getTokens, isAccessTokenValid } from '../../utils/tokenStorage';
import { ACTIVITY_PROGRESS_COUNT } from './RestActivity.constants';
import { RestActivityForm } from './RestActivityForm';
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
  const participantCount = locationState?.selectedRelax?.activeUserCount ?? ACTIVITY_PROGRESS_COUNT;
  const [showReselectModal, setShowReselectModal] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [isWritingStarted, setIsWritingStarted] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<SelectedActivityPhoto>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imagePreview = selectedPhoto?.previewSrc;

  useEffect(() => {
    return () => {
      if (imagePreview && isObjectUrl(imagePreview)) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handlePhotoSelect = (photo: SelectedActivityPhoto) => {
    setSelectedPhoto(photo);
    setShowPhotoPicker(false);
  };

  const handleConfirmReselect = () => navigate('/rest/checklist');

  const getValidAccessToken = async () => {
    const tokens = getTokens();

    if (!tokens) {
      throw new Error('로그인이 필요해요.');
    }

    if (isAccessTokenValid(tokens.accessToken)) {
      return tokens.accessToken;
    }

    return refreshStoredTokens();
  };

  const createFeedWithNativePhoto = async (
    assetId: string,
    request: FeedCreateRequest,
    baseUrl: string
  ) => {
    const accessToken = await getValidAccessToken();

    try {
      return await appBridge.createFeedWithGalleryPhoto(assetId, request, {
        accessToken,
        baseUrl
      });
    } catch (error) {
      if (!isNativeUploadUnauthorizedError(error)) {
        throw error;
      }

      const refreshedAccessToken = await refreshStoredTokens();

      return appBridge.createFeedWithGalleryPhoto(assetId, request, {
        accessToken: refreshedAccessToken,
        baseUrl
      });
    }
  };

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
        const baseUrl = import.meta.env.VITE_BASE_URL;

        if (!baseUrl) {
          throw new Error('API 주소가 설정되어 있지 않아요.');
        }

        await createFeedWithNativePhoto(selectedPhoto.assetId, request, baseUrl);
      }

      navigate('/feed');
    } catch (error) {
      console.error('Failed to create feed.', error);
      alert(error instanceof Error ? error.message : '피드 업로드에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      desc={locationState?.selectedRelax?.description ?? ''}
      imagePreview={imagePreview}
      isSubmitting={isSubmitting}
      showReselectModal={showReselectModal}
      onCancelReselect={() => setShowReselectModal(false)}
      onComplete={handleComplete}
      onConfirmReselect={handleConfirmReselect}
      onOpenPhotoPicker={() => setShowPhotoPicker(true)}
      onOpenReselectModal={() => setShowReselectModal(true)}
      title={
        locationState?.selectedRelax?.activeMessage ?? locationState?.selectedRelax?.name ?? ''
      }
    />
  );
}

export default RestActivity;
