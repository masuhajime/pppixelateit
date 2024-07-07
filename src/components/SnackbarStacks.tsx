// @flow
import { SnackbarContent, Stack } from '@mui/material';
import useSnackbar from '../store/snackbarStore';
import CloseIcon from '@mui/icons-material/Close';

type Props = {};
export const SnackbarStacks = (props: Props) => {
  const { snackBars, addSnackBar, removeSnackBar } = useSnackbar();

  return (
    <>
      <Stack spacing={2}>
        {snackBars.map((snackBar) => {
          return (
            <SnackbarContent
              key={snackBar.id}
              message={snackBar.message}
              action={
                <CloseIcon
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    removeSnackBar(snackBar.id);
                  }}
                ></CloseIcon>
              }
            ></SnackbarContent>
          );
        })}
      </Stack>
      {/* <button
        onClick={() => {
          addSnackBar('aaaaaaaaaaaaa');
        }}
      >
        add
      </button> */}
    </>
  );
};
