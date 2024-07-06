/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { updateSetting } from '../../store/store';
import {
  NodeData,
  handleSources,
  handleTargets,
} from './DirectorySubMoveNodeBehavior';
import { NodeBasic } from './components/NodeBasic';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceDirectory } from './items/HandleSourceDirectory';
import { HandleTargetDirectory } from './items/HandleTargetDirectory';
import { HandleTargetText } from './items/HandleTargetText';
import { Separator } from './items/Separator';

export function DirectorySubMoveNode({
  id,
  data,
  selected,
}: NodeProps<NodeData>) {
  return (
    <NodeBasic
      id={id}
      nodeName="DirectorySubMoveNode"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
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
    </NodeBasic>
  );
}
