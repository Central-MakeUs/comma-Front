export interface feedInfo {
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
