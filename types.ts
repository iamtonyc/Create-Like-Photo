
export interface ImageState {
  original: string | null;
  modified: string | null;
  mimeType: string | null;
}

export enum ActionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE'
}

export interface ProcessingState {
  isLoading: boolean;
  status: string;
}
