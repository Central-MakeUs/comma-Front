import type { EmblaCarouselType } from 'embla-carousel';
import { type RefObject, useEffect, useLayoutEffect, useState } from 'react';
import { computeLoopedLayout } from '../utils/compute_layout';
import { getCarouselLayoutScale } from '../utils/getCarouselLayoutScale';

export function useCarousel(
  containerRef: RefObject<HTMLDivElement | null>,
  cardCount: number,
  emblaApi: EmblaCarouselType | undefined,
  cardSize: { bigHeight: number; smallWidth: number; gap: number }
) {
  const [paths, setPaths] = useState<string[]>([]);
  const [sizes, setSizes] = useState<{ width: number; height: number }[]>([]);
  const [xs, setXs] = useState<number[]>([]);
  const [slideIdx, setSlideIdx] = useState(0);
  const [carouselLayoutScale, setCarouselLayoutScale] = useState(getCarouselLayoutScale);
  const layoutReady =
    cardCount > 0 &&
    paths.length === cardCount &&
    sizes.length === cardCount &&
    xs.length === cardCount;
  const carouselHeight = cardSize.bigHeight * carouselLayoutScale;
  const carouselSlideWidth = cardSize.smallWidth * carouselLayoutScale;
  const carouselGap = cardSize.gap * carouselLayoutScale;
  const isCompactHeight = carouselLayoutScale < 1;

  useLayoutEffect(() => {
    if (!containerRef.current || cardCount === 0) return;
    const viewportWidth = containerRef.current.getBoundingClientRect().width;
    const initialSnaps = Array.from({ length: cardCount }, (_, i) => i / cardCount);
    const { paths, sizes, xs } = computeLoopedLayout(
      initialSnaps,
      0,
      viewportWidth,
      cardCount,
      carouselLayoutScale
    );
    setPaths(paths);
    setSizes(sizes);
    setXs(xs);
  }, [cardCount, carouselLayoutScale]);

  useEffect(() => {
    const updateCarouselLayout = () => {
      setCarouselLayoutScale(getCarouselLayoutScale());
      emblaApi?.reInit();
    };

    const containerNode = containerRef.current;
    const resizeObserver =
      typeof ResizeObserver === 'undefined' || !containerNode
        ? null
        : new ResizeObserver(updateCarouselLayout);

    if (containerNode) {
      resizeObserver?.observe(containerNode);
    }
    window.addEventListener('resize', updateCarouselLayout);
    window.visualViewport?.addEventListener('resize', updateCarouselLayout);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateCarouselLayout);
      window.visualViewport?.removeEventListener('resize', updateCarouselLayout);
    };
  }, [emblaApi]);

  useLayoutEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();

    const updateCardTransforms = () => {
      const viewportWidth = emblaApi.rootNode().getBoundingClientRect().width;
      const scrollSnaps = emblaApi.scrollSnapList();
      const scrollProgress = emblaApi.scrollProgress();
      const { paths, sizes, xs } = computeLoopedLayout(
        scrollSnaps,
        scrollProgress,
        viewportWidth,
        cardCount,
        carouselLayoutScale
      );
      setPaths(paths);
      setSizes(sizes);
      setXs(xs);
    };
    const onSelect = () => {
      setSlideIdx(emblaApi.selectedScrollSnap());
    };
    updateCardTransforms();
    onSelect();
    emblaApi.on('scroll', updateCardTransforms);
    emblaApi.on('reInit', updateCardTransforms);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('scroll', updateCardTransforms);
      emblaApi.off('reInit', updateCardTransforms);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, cardCount, carouselLayoutScale]);

  return {
    paths,
    sizes,
    xs,
    slideIdx,
    layoutReady,
    carouselLayoutScale,
    carouselHeight,
    carouselSlideWidth,
    carouselGap,
    isCompactHeight
  };
}
