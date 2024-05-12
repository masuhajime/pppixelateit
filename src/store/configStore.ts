import { createJSONStorage, persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

export type ConfigState = {
  openDialogPreparedFlows: boolean;
  setOpenDialogPreparedFlows: (open: boolean) => void;
  getOpenDialogPreparedFlows: () => boolean;
};

const useConfigStore = createWithEqualityFn(
  persist(
    (set, get: () => ConfigState) => {
      return {
        openDialogPreparedFlows: false,
        setOpenDialogPreparedFlows: (open: boolean) => {
          set({ openDialogPreparedFlows: open });
        },
        getOpenDialogPreparedFlows: () => {
          return get().openDialogPreparedFlows;
        },
      };
    },
    {
      name: 'store-config',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        return {};
      },
    },
  ),
);

export default useConfigStore;
