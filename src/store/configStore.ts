import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

export type ConfigThemeType = "light" | "dark" | "system";

export type ConfigState = {
  openDialogPreparedFlows: boolean;
  setOpenDialogPreparedFlows: (open: boolean) => void;
  getOpenDialogPreparedFlows: () => boolean;
  openDialogSettings: boolean;
  setOpenDialogSettings: (open: boolean) => void;
  getOpenDialogSettings: () => boolean;

  // // configs
  theme: string; // cant use enum here, "light" | "dark" | "system"
  setTheme: (theme: ConfigThemeType) => void;
};

const useConfigStore = create(
  subscribeWithSelector(
    persist(
      (set, get: () => ConfigState) => {
        return {
          openDialogPreparedFlows: false,
          setOpenDialogPreparedFlows: (open: boolean) => {
            set({ openDialogPreparedFlows: open,
              openDialogSettings: false
             });
          },
          getOpenDialogPreparedFlows: () => {
            return get().openDialogPreparedFlows;
          },
          openDialogSettings: false,
          setOpenDialogSettings: (open: boolean) => {
            set({
              openDialogPreparedFlows: false,
              openDialogSettings: open });
          },
          getOpenDialogSettings: () => {
            return get().openDialogSettings;
          },
          theme: 'system',
          setTheme: (theme: ConfigThemeType) => {
            set({ theme });
          },
        };
      },
      {
        name: 'store-config',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => {
          return {
            theme: state.theme,
          };
        },
      },
    ),
  )
);

export default useConfigStore;
