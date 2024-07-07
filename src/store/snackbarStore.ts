import { createWithEqualityFn } from 'zustand/traditional';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type Snackbar = {
  id: string;
  message: string;
}

export type SnackbarState = {
  // snacks: 0;
  snackBars: Snackbar[];
  addSnackBar: (message: string, dismissIn?: number) => void;
  removeSnackBar: (id: string) => void;
};

const useSnackbar = create<SnackbarState>(
  (set) => ({
    // snacks: 0,
    snackBars: [],
    addSnackBar: (message, dismissIn = 5000) => {

      const id = uuidv4();
    set(state => {
      return {
        snackBars: [...state.snackBars, { id, message }],
      };
    });
      setTimeout(() => {
        set(state => {
          return {
            snackBars: state.snackBars.filter(snackBar => snackBar.id !== id),
          };
        });
      }, dismissIn);
    },
    removeSnackBar: id => {
      set(state => {
        return {
          snackBars: state.snackBars.filter(snackBar => snackBar.id !== id),
        };
      });
    },
  }),
);

export default useSnackbar;
