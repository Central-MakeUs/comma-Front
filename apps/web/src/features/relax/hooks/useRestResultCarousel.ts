import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { computeLoopedLayout } from '../../../shared/lib/computeLayout';
import { getRestResultCarouselScale } from '../lib/restResultState';

const getCurrentLayoutScale = () => {
  if (typeof window === 'undefined') return 1;
  return getRestResultCarouselScale(window.visualViewport?.height ?? window.innerHeight);
};

export function useRestResultCarousel(cardCount: number) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [layoutScale, setLayoutScale] = useState(getCurrentLayoutScale);
  const [paths, setPaths] = useState<string[]>([]);
  const [sizes, setSizes] = useState<Array<{ width: number; height: number }>>([]);
  const [xs, setXs] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    watchResize: false
  });

  const carouselRef = useCallback(
    (node: HTMLDivElement | null) => {
      emblaRef(node);
      containerRef.current = node;
    },
    [emblaRef]
  );

  useLayoutEffect(() => {
    if (!containerRef.current || cardCount === 0) return;
    const viewportWidth = containerRef.current.getBoundingClientRect().width;
    const initialSnaps = Array.from({ length: cardCount }, (_, index) => index / cardCount);
    const layout = computeLoopedLayout(initialSnaps, 0, viewportWidth, cardCount, layoutScale);
    setPaths(layout.paths);
    setSizes(layout.sizes);
    setXs(layout.xs);
  }, [cardCount, layoutScale]);

  useEffect(() => {
    const updateCarouselLayout = () => {
      setLayoutScale(getCurrentLayoutScale());
      emblaApi?.reInit();
    };
    const containerNode = containerRef.current;
    const resizeObserver =
      typeof ResizeObserver === 'undefined' || !containerNode
        ? null
        : new ResizeObserver(updateCarouselLayout);

    resizeObserver?.observe(containerNode as HTMLDivElement);
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
      const layout = computeLoopedLayout(
        emblaApi.scrollSnapList(),
        emblaApi.scrollProgress(),
        emblaApi.rootNode().getBoundingClientRect().width,
        cardCount,
        layoutScale
      );
      setPaths(layout.paths);
      setSizes(layout.sizes);
      setXs(layout.xs);
    };
    const updateSelectedIndex = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    updateCardTransforms();
    updateSelectedIndex();
    emblaApi.on('scroll', updateCardTransforms);
    emblaApi.on('reInit', updateCardTransforms);
    emblaApi.on('select', updateSelectedIndex);

    return () => {
      emblaApi.off('scroll', updateCardTransforms);
      emblaApi.off('reInit', updateCardTransforms);
      emblaApi.off('select', updateSelectedIndex);
    };
  }, [emblaApi, cardCount, layoutScale]);

  return {
    carouselRef,
    layout: {
      isReady:
        cardCount > 0 &&
        paths.length === cardCount &&
        sizes.length === cardCount &&
        xs.length === cardCount,
      paths,
      sizes,
      xs
    },
    layoutScale,
    selectedIndex
  };
}
