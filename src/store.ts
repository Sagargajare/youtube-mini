import { create } from "zustand";

type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

type Snippet = {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
    standard?: Thumbnail;
    maxres?: Thumbnail;
  };
  channelTitle: string;
  categoryId: string;
  liveBroadcastContent: string;
  localized: {
    title: string;
    description: string;
  };
};

type Status = {
  uploadStatus: string;
  privacyStatus: string;
  license: string;
  embeddable: boolean;
  publicStatsViewable: boolean;
  madeForKids: boolean;
  selfDeclaredMadeForKids: boolean;
};

type Video = {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
  status: Status;
};

type VideoStore = {
  videos: Video[];
  setVideos: (videos: Video[]) => void;
  updateVideoMetadata: (id: string, title: string, description: string) => void;
};

export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],

  setVideos: (videos) => set({ videos }),

  updateVideoMetadata: (id, newTitle, newDescription) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === id
          ? {
              ...video,
              snippet: {
                ...video.snippet,
                title: newTitle,
                description: newDescription,
                localized: {
                  ...video.snippet.localized,
                  title: newTitle,
                  description: newDescription,
                },
              },
            }
          : video
      ),
    })),
}));
