import { type ReactNode, useEffect, useRef } from 'react';
import * as styles from './Modal.css';

export type ModalBackdropTone = keyof typeof styles.backdropTone;

export type ModalProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  backdropTone?: ModalBackdropTone;
  children: ReactNode;
  className?: string;
  closeOnBackdrop?: boolean;
  onClose: () => void;
  overlayClassName?: string;
};

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export function Modal({
  'aria-describedby': ariaDescribedby,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  backdropTone = 'dim',
  children,
  className,
  closeOnBackdrop = true,
  onClose,
  overlayClassName
}: ModalProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const surface = surfaceRef.current;
    const firstFocusable = surface?.querySelector<HTMLElement>(focusableSelector);

    document.body.style.overflow = 'hidden';
    (firstFocusable ?? surface)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !surface) return;

      const focusable = Array.from(surface.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) {
        event.preventDefault();
        surface.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div className={[styles.overlay, overlayClassName].filter(Boolean).join(' ')}>
      {closeOnBackdrop ? (
        <button
          aria-label="대화상자 닫기"
          className={[styles.backdrop, styles.backdropTone[backdropTone]].join(' ')}
          onClick={onClose}
          type="button"
        />
      ) : (
        <div
          aria-hidden="true"
          className={[styles.backdrop, styles.backdropTone[backdropTone]].join(' ')}
        />
      )}
      <div
        aria-describedby={ariaDescribedby}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-modal="true"
        className={[styles.surface, className].filter(Boolean).join(' ')}
        ref={surfaceRef}
        role="dialog"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
