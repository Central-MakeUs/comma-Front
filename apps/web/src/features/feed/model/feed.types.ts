export interface FeedInfo {
  feedId: number;
  mood: string;
  timeBudget: string;
  imageUrl: string;
  hashtags: string[];
  review: string;
  isPublic: boolean;
  createdAt: string;
  isLiked: boolean;
  likeCount: number;
  nickname?: string;
}

export interface FeedPage {
  items: FeedInfo[];
  nextCursor: number;
  hasNext: boolean;
}
