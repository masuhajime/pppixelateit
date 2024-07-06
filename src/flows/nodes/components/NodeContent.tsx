// @flow
import { CardContent, styled } from '@mui/material';
import * as React from 'react';

const CardContentStyled = styled(CardContent)`
  &:last-child {
    padding-bottom: 8px;
  }
`;

type Props = {
  children?: React.ReactNode;
};

export const NodeContent = (props: Props) => {
  return (
    <CardContentStyled
      sx={{
        padding: '0',
        paddingY: '8px',
      }}
    >
      {props.children}
    </CardContentStyled>
  );
};
