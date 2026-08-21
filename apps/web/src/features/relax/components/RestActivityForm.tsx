import {
  CtaButton,
  colors,
  Icon,
  ImageUpload,
  SecretToggle,
  TextInput
} from '@comma/design-system';
import {
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { BackgroundImage } from '../../../shared/components/layout';
import { QueryFeedback } from '../../../shared/components/QueryFeedback';
import { COMMENT_MAX_LENGTH, TAG_MAX_LENGTH } from '../model/restActivity.constants';
import * as sharedStyles from './RestActivity.shared.css';
import * as styles from './RestActivityForm.css';
import { RestActivityReselectModal } from './RestActivityReselectModal';

type RestActivityFormProps = {
  draft: RestActivityDraft;
  imagePreview?: string;
  isSubmitting?: boolean;
  submissionError?: string;
  title: string;
  desc: string;
  showReselectModal: boolean;
  onOpenPhotoPicker: () => void;
  onDraftChange: Dispatch<SetStateAction<RestActivityDraft>>;
  onOpenReselectModal: () => void;
  onCancelReselect: () => void;
  onConfirmReselect: () => void;
  onComplete: (values: { hashtags: string[]; review: string; isPublic: boolean }) => void;
};

export type RestActivityDraft = {
  tagInput: string;
  tags: string[];
  comment: string;
  isSecret: boolean;
};

function normalizeTag(value: string) {
  return value.replace(/^#+\s*/, '').trim();
}

function appendTag(tags: string[], tagInput: string) {
  const nextTag = normalizeTag(tagInput);

  if (!nextTag || tags.includes(nextTag) || tags.length >= 2) return tags;

  return [...tags, nextTag];
}

export function RestActivityForm({
  draft,
  imagePreview,
  isSubmitting = false,
  submissionError,
  title,
  desc,
  showReselectModal,
  onOpenPhotoPicker,
  onDraftChange,
  onOpenReselectModal,
  onCancelReselect,
  onConfirmReselect,
  onComplete
}: RestActivityFormProps) {
  const [focusedInput, setFocusedInput] = useState<'tag' | 'comment'>();
  const pageRef = useRef<HTMLElement | null>(null);
  const touchScrollRef = useRef({
    isDragging: false,
    scrollTop: 0,
    y: 0
  });
  const { tagInput, tags, comment, isSecret } = draft;

  useLayoutEffect(() => {
    if (!imagePreview) return undefined;

    const resetScrollPosition = () => {
      if (pageRef.current) pageRef.current.scrollTop = 0;
      window.scrollTo(0, 0);
    };

    resetScrollPosition();
    const animationFrame = window.requestAnimationFrame(resetScrollPosition);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [imagePreview]);

  const handleAddTag = () => {
    onDraftChange((currentDraft) => {
      const nextTags = appendTag(currentDraft.tags, currentDraft.tagInput);

      if (nextTags === currentDraft.tags) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        tagInput: '',
        tags: nextTags
      };
    });
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (event.nativeEvent.isComposing) return;

    event.preventDefault();
    window.setTimeout(handleAddTag, 0);
  };

  const handleTagBlur = () => {
    setFocusedInput(undefined);
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
  const completedTags = appendTag(tags, tagInput);
  const commentState = isCommentOverLimit
    ? 'filled'
    : focusedInput === 'comment'
      ? 'type'
      : comment.length > 0
        ? 'filled'
        : 'default';
  const isComplete =
    Boolean(imagePreview) &&
    completedTags.length > 0 &&
    comment.trim().length > 0 &&
    !isCommentOverLimit;
  const isDoneDisabled = !isComplete || isSubmitting;
  const handleOpenPhotoPicker = () => {
    if (touchScrollRef.current.isDragging) {
      touchScrollRef.current.isDragging = false;
      return;
    }

    onOpenPhotoPicker();
  };

  return (
    <main className={sharedStyles.page} ref={pageRef}>
      <div className={sharedStyles.screen}>
        {imagePreview ? (
          <BackgroundImage className={sharedStyles.backgroundImage} src={imagePreview} />
        ) : null}
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

        <section
          className={styles.content}
          aria-labelledby="rest-activity-title"
          onTouchEndCapture={() => {
            window.setTimeout(() => {
              touchScrollRef.current.isDragging = false;
            }, 0);
          }}
          onTouchMoveCapture={(event) => {
            const touch = event.touches[0];
            const page = pageRef.current;
            if (!touch || !page) return;

            const nextScrollTop =
              touchScrollRef.current.scrollTop + touchScrollRef.current.y - touch.clientY;
            if (Math.abs(touch.clientY - touchScrollRef.current.y) > 6) {
              touchScrollRef.current.isDragging = true;
            }
            page.scrollTop = nextScrollTop;
          }}
          onTouchStartCapture={(event) => {
            const touch = event.touches[0];
            const page = pageRef.current;
            if (!touch || !page) return;

            touchScrollRef.current = {
              isDragging: false,
              scrollTop: page.scrollTop,
              y: touch.clientY
            };
          }}
        >
          <header className={styles.header}>
            <button
              aria-label="휴식 재선택"
              className={sharedStyles.iconButton}
              onClick={onOpenReselectModal}
              type="button"
              style={{
                width: 44,
                height: 44
              }}
            >
              <Icon color={colors.iconPrimary} name="x" />
            </button>
          </header>
          <div className={styles.heroText}>
            <h1 className={sharedStyles.title} id="rest-activity-title">
              {title}
            </h1>
            <p className={sharedStyles.description}>{desc}</p>
          </div>

          <div className={styles.uploadArea}>
            <ImageUpload
              className={sharedStyles.upload}
              imageAlt="업로드한 휴식 사진"
              imageSrc={imagePreview}
              onClick={handleOpenPhotoPicker}
              state={imagePreview ? 'exist' : 'none'}
            />
          </div>

          <div className={styles.formStack}>
            <div className={styles.tagSection}>
              <TextInput
                className={styles.input}
                maxLength={TAG_MAX_LENGTH}
                onBlur={handleTagBlur}
                onChange={(tagInput) =>
                  onDraftChange((currentDraft) => ({ ...currentDraft, tagInput }))
                }
                onFocus={() => setFocusedInput('tag')}
                onKeyDown={handleTagKeyDown}
                onPlusClick={handleAddTag}
                placeholder="예) 한강, 힐링"
                state={tagInputState}
                title="해시태그 추가"
                value={tagInput}
                variant="field"
                helperText={tagInputState === 'focus' ? '최대 2개까지 입력할 수 있어요' : undefined}
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
              onChange={(comment) =>
                onDraftChange((currentDraft) => ({ ...currentDraft, comment }))
              }
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

        {submissionError ? <QueryFeedback message={submissionError} state="error" /> : null}

        <footer className={styles.footer}>
          <div className={styles.visibilityRow}>
            <span className={styles.visibilityLabel}>공개 여부</span>
            <SecretToggle
              checked={isSecret}
              onCheckedChange={(isSecret) =>
                onDraftChange((currentDraft) => ({ ...currentDraft, isSecret }))
              }
            />
          </div>
          <CtaButton
            className={sharedStyles.doneButton}
            disabled={isDoneDisabled}
            onClick={() =>
              onComplete({
                hashtags: completedTags,
                review: comment.trim(),
                isPublic: !isSecret
              })
            }
          >
            {isSubmitting ? '올리는 중' : '휴식 완료'}
          </CtaButton>
        </footer>

        {showReselectModal ? (
          <RestActivityReselectModal onCancel={onCancelReselect} onConfirm={onConfirmReselect} />
        ) : null}
      </div>
    </main>
  );
}
