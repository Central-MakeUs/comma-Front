export type MoodType = 'A' | 'B' | 'C';
export type TimeType = 'X' | 'Y' | 'Z';

export interface RelaxActivity {
  id: number;
  name: string;
  description: string;
  activeMessage: string;
  imageUrl: string | null;
  activeUserCount: number;
}

export interface RestResultLocationState {
  data?: RelaxActivity[];
}

export interface RestLoadingLocationState {
  data?: RelaxActivity[];
  selectedRelax?: RelaxActivity;
}
