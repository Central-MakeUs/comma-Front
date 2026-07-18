import {
  CtaButton,
  colors,
  Icon,
  ImageUpload,
  SecretToggle,
  TextInput
} from '@comma/design-system';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { type KeyboardEvent, useState } from 'react';
import {
  COMMENT_MAX_LENGTH,
  REST_DESCRIPTION,
  REST_TITLE,
  TAG_MAX_LENGTH
} from './RestActivity.constants';
import * as sharedStyles from './RestActivity.shared.css';
import * as styles from './RestActivityForm.css';
import { RestActivityReselectModal } from './RestActivityReselectModal';

type RestActivityFormProps = {
  imagePreview?: string;
  showReselectModal: boolean;
  onOpenPhotoPicker: () => void;
  onOpenReselectModal: () => void;
  onCancelReselect: () => void;
  onConfirmReselect: () => void;
  onComplete: () => void;
};

function normalizeTag(value: string) {
  return value.replace(/^#+\s*/, '').trim();
}

export function RestActivityForm({
  imagePreview,
  showReselectModal,
  onOpenPhotoPicker,
  onOpenReselectModal,
  onCancelReselect,
  onConfirmReselect,
  onComplete
}: RestActivityFormProps) {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [focusedInput, setFocusedInput] = useState<'tag' | 'comment'>();
  const [isSecret, setIsSecret] = useState(false);

  const handleAddTag = () => {
    const nextTag = normalizeTag(tagInput);

    if (!nextTag || tags.includes(nextTag)) return;

    setTags((currentTags) => [...currentTags, nextTag]);
    setTagInput('');
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (event.nativeEvent.isComposing) return;

    event.preventDefault();
    handleAddTag();
  };

  const tagInputState =
    focusedInput === 'tag'
      ? tagInput.length > 0
        ? 'type'
        : 'focus'
      : tagInput.length > 0
        ? 'filledPlus'
        : 'default';
  const isCommentOverLimit = comment.length > COMMENT_MAX_LENGTH;
  const commentState = isCommentOverLimit
    ? 'filled'
    : focusedInput === 'comment'
      ? 'type'
      : comment.length > 0
        ? 'filled'
        : 'default';
  const isComplete =
    Boolean(imagePreview) && tags.length > 0 && comment.trim().length > 0 && !isCommentOverLimit;

  return (
    <main className={sharedStyles.page}>
      <div
        className={sharedStyles.screen}
        style={
          imagePreview
            ? assignInlineVars({
                [sharedStyles.backgroundImageVar]: `url(${imagePreview})`
              })
            : undefined
        }
      >
        <div
          aria-hidden="true"
          className={[
            sharedStyles.dimOverlay,
            imagePreview ? sharedStyles.dimOverlayVisible : undefined
          ]
            .filter(Boolean)
            .join(' ')}
        />
        <div aria-hidden="true" className={sharedStyles.topGradient} />
        <div aria-hidden="true" className={sharedStyles.bottomGradient} />

        <header className={styles.header}>
          <button
            aria-label="휴식 재선택"
            className={sharedStyles.iconButton}
            onClick={onOpenReselectModal}
            type="button"
          >
            <Icon color={colors.iconPrimary} name="x" />
          </button>
        </header>

        <section className={styles.content} aria-labelledby="rest-activity-title">
          <div className={styles.heroText}>
            <h1 className={sharedStyles.title} id="rest-activity-title">
              {REST_TITLE}
            </h1>
            <p className={sharedStyles.description}>{REST_DESCRIPTION}</p>
          </div>

          <div className={styles.uploadArea}>
            <ImageUpload
              className={sharedStyles.upload}
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
                onBlur={() => setFocusedInput(undefined)}
                onChange={setTagInput}
                onFocus={() => setFocusedInput('tag')}
                onKeyDown={handleTagKeyDown}
                onPlusClick={handleAddTag}
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
              onBlur={() => setFocusedInput(undefined)}
              onChange={setComment}
              onFocus={() => setFocusedInput('comment')}
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
            <SecretToggle checked={isSecret} onCheckedChange={setIsSecret} />
          </div>
          <CtaButton
            className={sharedStyles.doneButton}
            disabled={!isComplete}
            onClick={onComplete}
          >
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
