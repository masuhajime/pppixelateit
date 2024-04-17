import { styled } from '@mui/material';
import React from 'react';

const BackgroundRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: 0,
  margin: 0,
}));

type Props = {
  children: React.ReactNode;
};
export default function ThemedBackground(props: Props) {
  const { children } = props;
  return <BackgroundRoot>{children}</BackgroundRoot>;
}
