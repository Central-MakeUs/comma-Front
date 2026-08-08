import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  type ActivityCarouselLayout,
  computeActivityCarouselLayout,
  getActivityBackground
} from '../lib/activityCarouselLayout';

const initialLayout: ActivityCarouselLayout = {
  layoutScale: 1,
  paths: [],
  sizes: [],
  xs: []
};

export function useActivityCarousel(cardCount: number) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    containScroll: false,
    watchResize: false
  });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [layout, setLayout] = useState<ActivityCarouselLayout>(initialLayout);

  const carouselRef = useCallback(
    (node: HTMLDivElement | null) => {
      emblaRef(node);
      containerRef.current = node;
    },
    [emblaRef]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const viewportWidth = containerRef.current.getBoundingClientRect().width;
    setLayout(computeActivityCarouselLayout(0, viewportWidth, cardCount));
  }, [cardCount]);

  useLayoutEffect(() => {
    if (!emblaApi || cardCount === 0) {
      setBackgroundUrl('');
      return;
    }

    const updateLayout = () => {
      const viewportWidth = emblaApi.rootNode().getBoundingClientRect().width;
      const virtualIndex = emblaApi.scrollProgress() * (cardCount - 1);
      setLayout(computeActivityCarouselLayout(virtualIndex, viewportWidth, cardCount));
    };
    const updateBackground = () => {
      setBackgroundUrl(getActivityBackground(emblaApi.selectedScrollSnap()));
    };

    updateLayout();
    updateBackground();
    emblaApi.on('scroll', updateLayout);
    emblaApi.on('reInit', updateLayout);
    emblaApi.on('select', updateBackground);

    return () => {
      emblaApi.off('scroll', updateLayout);
      emblaApi.off('reInit', updateLayout);
      emblaApi.off('select', updateBackground);
    };
  }, [cardCount, emblaApi]);

  return { backgroundUrl, carouselRef, layout };
}
