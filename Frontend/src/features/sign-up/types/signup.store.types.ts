export type VideoStateStore = {
    video: Blob | undefined;
    setVideo: (video: Blob) => void;
    removeVideo: () => void;
  };

