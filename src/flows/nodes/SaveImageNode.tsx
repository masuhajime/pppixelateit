/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import path from 'path';
import useNodeStore from '../../store/store';
import { NodeData, handleTargets } from './SaveImageNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { NodeStatus } from './components/NodeStatus';
import { HandleTargetDirectory } from './items/HandleTargetDirectory';
import { HandleTargetImage } from './items/HandleTargetImage';
import { HandleTargetText } from './items/HandleTargetText';
import { Separator } from './items/Separator';

export function SaveImageNode({ id, data }: NodeProps<NodeData>) {
  const dir = data.directory || data.settings.directory || '';
  const file = data.filename || data.settings.filename;
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="Save Image" nodeId={id} />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <HandleTargetDirectory
          directory={dir}
          placeholder="Select Directory"
          handleId={handleTargets.directory.id}
          nodeId={id}
          onChange={(value) => {
            useNodeStore.getState().updateNodeData<NodeData>(id, {
              directory: value,
            });
          }}
          name="directory"
        />
        <HandleTargetText
          name="file name"
          handleId={handleTargets.filename.id}
          nodeId={id}
          defaultValue={file || ''}
          onChange={(value) => {
            useNodeStore.getState().updateNodeData<NodeData>(id, {
              filename: value,
            });
          }}
        />
        <Separator />
        <NodeStatus nodeData={data} />
      </NodeContent>
    </Node>
  );
}
