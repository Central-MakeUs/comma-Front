import {
  CtaButton,
  colors,
  Icon,
  ImageUpload,
  SecretToggle,
  TextInput
} from '@comma/design-system';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { KeyboardEventHandler } from 'react';
import {
  COMMENT_MAX_LENGTH,
  REST_DESCRIPTION,
  REST_TITLE,
  TAG_MAX_LENGTH
} from './RestActivity.constants';
import * as styles from './RestActivity.css';
import { RestActivityReselectModal } from './RestActivityReselectModal';

type RestActivityFormProps = {
  imagePreview?: string;
  tagInput: string;
  tags: string[];
  comment: string;
  tagInputState: 'default' | 'focus' | 'type' | 'filled' | 'filledPlus';
  commentState: 'default' | 'focus' | 'type' | 'filled' | 'filledPlus';
  isCommentOverLimit: boolean;
  isComplete: boolean;
  isSecret: boolean;
  showReselectModal: boolean;
  onOpenPhotoPicker: () => void;
  onOpenReselectModal: () => void;
  onCancelReselect: () => void;
  onConfirmReselect: () => void;
  onComplete: () => void;
  onTagInputChange: (value: string) => void;
  onTagInputFocus: () => void;
  onTagInputBlur: () => void;
  onTagKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onAddTag: () => void;
  onCommentChange: (value: string) => void;
  onCommentFocus: () => void;
  onCommentBlur: () => void;
  onSecretChange: (checked: boolean) => void;
};

export function RestActivityForm({
  imagePreview,
  tagInput,
  tags,
  comment,
  tagInputState,
  commentState,
  isCommentOverLimit,
  isComplete,
  isSecret,
  showReselectModal,
  onOpenPhotoPicker,
  onOpenReselectModal,
  onCancelReselect,
  onConfirmReselect,
  onComplete,
  onTagInputChange,
  onTagInputFocus,
  onTagInputBlur,
  onTagKeyDown,
  onAddTag,
  onCommentChange,
  onCommentFocus,
  onCommentBlur,
  onSecretChange
}: RestActivityFormProps) {
  return (
    <main className={styles.page}>
      <div
        className={styles.screen}
        style={
          imagePreview
            ? assignInlineVars({
                [styles.backgroundImageVar]: `url(${imagePreview})`
              })
            : undefined
        }
      >
        <div
          aria-hidden="true"
          className={[styles.dimOverlay, imagePreview ? styles.dimOverlayVisible : undefined]
            .filter(Boolean)
            .join(' ')}
        />
        <div aria-hidden="true" className={styles.topGradient} />
        <div aria-hidden="true" className={styles.bottomGradient} />

        <header className={styles.header}>
          <button
            aria-label="휴식 재선택"
            className={styles.iconButton}
            onClick={onOpenReselectModal}
            type="button"
          >
            <Icon color={colors.iconPrimary} name="x" />
          </button>
        </header>

        <section className={styles.content} aria-labelledby="rest-activity-title">
          <div className={styles.heroText}>
            <h1 className={styles.title} id="rest-activity-title">
              {REST_TITLE}
            </h1>
            <p className={styles.description}>{REST_DESCRIPTION}</p>
          </div>

          <div className={styles.uploadArea}>
            <ImageUpload
              className={styles.upload}
              imageAlt="업로드한 휴식 사진"
              imageSrc={imagePreview}
              onClick={onOpenPhotoPicker}
              state={imagePreview ? 'exist' : 'none'}
            />
          </div>

          <div className={styles.formStack}>
            <div className={styles.tagSection}>
              <TextInput
                className={styles.input}
                maxLength={TAG_MAX_LENGTH}
                onBlur={onTagInputBlur}
                onChange={onTagInputChange}
                onFocus={onTagInputFocus}
                onKeyDown={onTagKeyDown}
                onPlusClick={onAddTag}
                placeholder="예) 한강, 힐링"
                state={tagInputState}
                title="해시태그 추가"
                value={tagInput}
                variant="field"
              />
              {tags.length > 0 ? (
                <div className={styles.tagList}>
                  {tags.map((tag) => (
                    <span className={styles.tag} key={tag}>
                      # {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <TextInput
              className={styles.input}
              enforceMaxLength={false}
              helperText={comment.length > 0 ? '최대 20자까지 입력할 수 있어요' : undefined}
              helperTone={isCommentOverLimit ? 'error' : 'default'}
              maxLength={COMMENT_MAX_LENGTH}
              onBlur={onCommentBlur}
              onChange={onCommentChange}
              onFocus={onCommentFocus}
              placeholder="예) 오랜만에 바람 쐬니 좋네요"
              showFooter={comment.length > 0}
              state={commentState}
              title="한 줄 소감"
              value={comment}
              variant="field"
            />
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.visibilityRow}>
            <span className={styles.visibilityLabel}>공개 여부</span>
            <SecretToggle checked={isSecret} onCheckedChange={onSecretChange} />
          </div>
          <CtaButton className={styles.doneButton} disabled={!isComplete} onClick={onComplete}>
            휴식 완료
          </CtaButton>
        </footer>

        {showReselectModal ? (
          <RestActivityReselectModal onCancel={onCancelReselect} onConfirm={onConfirmReselect} />
        ) : null}
      </div>
    </main>
  );
}
