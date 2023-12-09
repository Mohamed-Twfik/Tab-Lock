import { create } from "zustand";
import { VideoStateStore } from "../types/signup.store.types";


export const useVideoStore = create<VideoStateStore>((set) => ({
  video: undefined,
  setVideo: (video) => set({ video }),
  removeVideo: () => set({ video: undefined }),
}));


