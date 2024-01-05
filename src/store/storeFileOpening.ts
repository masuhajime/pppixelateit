import { createJSONStorage, persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

export type FileOpeningState = {
  filePathOpening?: string;
  setFilePathOpening: (filePath?: string) => void;
  getFilePathOpening: () => string | undefined;
};

const useFileOpening = createWithEqualityFn(
  persist(
    (set, get: () => FileOpeningState) => {
      return {
        filePathOpening: undefined,
        setFilePathOpening: (filePath?: string) => {
          set({ filePathOpening: filePath });
        },
        getFilePathOpening: () => {
          return get().filePathOpening;
        },
      };
    },
    {
      name: 'store-file-opening',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        return {
          filePathOpening: state.filePathOpening,
        };
      },
    },
  ),
);

export default useFileOpening;
