export const getCarouselLayoutScale = () => {
  if (typeof window === 'undefined') return 1;

  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

  if (viewportHeight <= 700) return 0.84;
  if (viewportHeight <= 760) return 0.92;

  return 1;
};
