import type { ComponentProps } from 'react';
import { Modal } from '../Modal';
import * as styles from './BottomSheet.css';

export type BottomSheetProps = Omit<ComponentProps<typeof Modal>, 'className'> & {
  className?: string;
};

export function BottomSheet({ className, ...props }: BottomSheetProps) {
  return <Modal {...props} className={[styles.sheet, className].filter(Boolean).join(' ')} />;
}
