/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { useStore } from 'zustand';
import useNodeStore, { updateSetting } from '../../store/store';
import {
  NodeData,
  handleSources,
  handleTargets,
} from './DirectorySubMoveNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { NodeStatus } from './components/NodeStatus';
import { HandleTargetText } from './items/HandleTargetText';
import { Separator } from './items/Separator';
import { HandleSourceDirectory } from './items/HandleSourceDirectory';
import { HandleTargetDirectory } from './items/HandleTargetDirectory';

export function DirectorySubMoveNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="SubDirectory Move" />
      <NodeContent>
        <HandleTargetDirectory
          handleId={handleTargets.directory.id}
          name="Directory"
          nodeId={id}
          placeholder="Directory"
          directory={data.directory || 'Directory'}
          disabled
          required
        />
        <HandleTargetText
          name="Subdirectory Name"
          handleId={handleTargets.text.id}
          nodeId={id}
          defaultValue={data.settings.text || ''}
          value={data.settings.text || ''}
          onChange={updateSetting(id, 'text')}
          required
        />
        <HandleSourceDirectory
          handleId={handleSources.directory.id}
          label="Directory"
          nodeId={id}
          placeholder={data.result || 'Directory'}
          directory=""
          disabled
        />
        <Separator />
        <NodeStatus nodeData={data} />
      </NodeContent>
    </Node>
  );
}
