// @flow
import * as React from 'react';
import { useMemoNodeDefine } from '../../../hooks/useMemoNodeDefine';
import { Node } from './Node';
import { NodeHeader } from './NodeHeader';
import { NodeContent } from './NodeContent';
type Props = {
  id: string;
  nodeName: string;
  status?: 'processing' | 'waiting' | 'editing';
  displayBorder?: boolean;
  children: React.ReactNode;
};
export const NodeBasic = (props: Props) => {
  const { id, nodeName, children } = props;
  const nodeDefine = useMemoNodeDefine(nodeName);

  return (
    <Node colorBorder={nodeDefine.color} displayBorder={props.displayBorder}>
      <NodeHeader
        title={nodeDefine.nameDisplay}
        nodeId={id}
        color={nodeDefine.color}
      />
      <NodeContent>{children}</NodeContent>
    </Node>
  );
};
