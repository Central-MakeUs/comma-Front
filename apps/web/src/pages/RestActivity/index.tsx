import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RestLoadingLocationState } from '../../types/relax';
import { ACTIVITY_PROGRESS_COUNT } from './RestActivity.constants';
import { RestActivityForm } from './RestActivityForm';
import { RestActivityPhotoPicker } from './RestActivityPhotoPicker';
import { RestActivityProgress } from './RestActivityProgress';

function isObjectUrl(value?: string) {
  return value?.startsWith('blob:') ?? false;
}

function RestActivity() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as RestLoadingLocationState | null;
  const participantCount = locationState?.selectedRelax?.activeUserCount ?? ACTIVITY_PROGRESS_COUNT;
  const [showReselectModal, setShowReselectModal] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [isWritingStarted, setIsWritingStarted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>();

  useEffect(() => {
    return () => {
      if (imagePreview && isObjectUrl(imagePreview)) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handlePhotoSelect = (src: string) => {
    setImagePreview((currentPreview) => {
      if (currentPreview && isObjectUrl(currentPreview)) {
        URL.revokeObjectURL(currentPreview);
      }

      return src;
    });
    setShowPhotoPicker(false);
  };

  const handleConfirmReselect = () => navigate('/rest/checklist');
  const handleComplete = () => navigate('/rest/result');

  if (!isWritingStarted) {
    return (
      <RestActivityProgress
        participantCount={participantCount}
        showReselectModal={showReselectModal}
        onCancelReselect={() => setShowReselectModal(false)}
        onComplete={() => setIsWritingStarted(true)}
        onConfirmReselect={handleConfirmReselect}
        onOpenReselectModal={() => setShowReselectModal(true)}
        title={locationState?.selectedRelax?.name}
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
      imagePreview={imagePreview}
      showReselectModal={showReselectModal}
      onCancelReselect={() => setShowReselectModal(false)}
      onComplete={handleComplete}
      onConfirmReselect={handleConfirmReselect}
      onOpenPhotoPicker={() => setShowPhotoPicker(true)}
      onOpenReselectModal={() => setShowReselectModal(true)}
    />
  );
}

export default RestActivity;
