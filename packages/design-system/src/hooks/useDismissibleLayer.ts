import { type RefObject, useEffect, useRef } from 'react';

export interface UseDismissibleLayerOptions {
  dismissOnScroll?: boolean;
  enabled: boolean;
  onDismiss: () => void;
}

export function useDismissibleLayer<TElement extends HTMLElement>({
  dismissOnScroll = false,
  enabled,
  onDismiss
}: UseDismissibleLayerOptions): RefObject<TElement | null> {
  const containerRef = useRef<TElement>(null);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!enabled) return;

    const dismiss = () => onDismissRef.current();
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || containerRef.current?.contains(target)) return;

      dismiss();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);
    if (dismissOnScroll) document.addEventListener('scroll', dismiss, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
      if (dismissOnScroll) document.removeEventListener('scroll', dismiss, true);
    };
  }, [dismissOnScroll, enabled]);

  return containerRef;
}
