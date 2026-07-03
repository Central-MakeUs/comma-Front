import { designAssets } from '@comma/design-system';

export type ArchiveViewMode = 'list' | 'grid';

export type ArchiveItem = {
  id: number;
  imageSrc: string;
  imageAlt: string;
  dateLabel: string;
  content: string;
  tags: string[];
  likeCount: number;
  liked: boolean;
};

export const ARCHIVE_TITLE = '내 쉼표';

export const ARCHIVE_ITEMS = [
  {
    id: 1,
    imageSrc: designAssets.feed.image.src,
    imageAlt: '한강 풍경',
    dateLabel: '2026. 07. 23',
    content: '오랜만에 하늘 보면서 숨 쉬니까 좋네요',
    tags: ['한강', '힐링'],
    likeCount: 12,
    liked: true
  },
  {
    id: 2,
    imageSrc: designAssets.feed.image.src,
    imageAlt: '노을이 보이는 산책길',
    dateLabel: '2026. 07. 21',
    content: '해가 지는 시간에 맞춰 천천히 걸었어요',
    tags: ['산책', '노을'],
    likeCount: 8,
    liked: true
  },
  {
    id: 3,
    imageSrc: designAssets.feed.image.src,
    imageAlt: '조용한 카페 테이블',
    dateLabel: '2026. 07. 18',
    content: '책 한 장 넘기면서 쉬는 시간이 생각보다 오래 남네요',
    tags: ['독서', '카페'],
    likeCount: 24,
    liked: true
  },
  {
    id: 4,
    imageSrc: designAssets.feed.image.src,
    imageAlt: '창가에 들어온 햇빛',
    dateLabel: '2026. 07. 14',
    content: '아무것도 하지 않고 창밖만 바라봤어요',
    tags: ['멍때리기', '쉼'],
    likeCount: 5,
    liked: false
  }
] as const satisfies readonly ArchiveItem[];
