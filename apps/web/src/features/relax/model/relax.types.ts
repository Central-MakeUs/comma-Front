import type { FeedMood, FeedTimeBudget } from '@comma/bridge';

export interface RelaxActivity {
  id: number;
  name: string;
  description: string;
  activeMessage: string;
  imageUrl: string | null;
  activeUserCount: number;
  activityId?: number;
}

export interface RestResultLocationState {
  data?: RelaxActivity[];
  mood?: FeedMood;
  timeBudget?: FeedTimeBudget;
}

export interface RestLoadingLocationState {
  data?: RelaxActivity[];
  selectedRelax?: RelaxActivity;
  mood?: FeedMood;
  timeBudget?: FeedTimeBudget;
}
