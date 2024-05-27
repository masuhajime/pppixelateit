import {
  NodeBehaviorInterface,
  getNodeBehaviorCacheByType,
  nodeBehaviorCacheAll,
} from '../flows/nodes/data/NodeData';
import useProcessStore from '../store/processStore';
import useNodeStore from '../store/store';

class ProcessController {
  async start() {
    await nodeBehaviorCacheAll();

    const nodeStore = useNodeStore.getState();
    useProcessStore.getState().start();
    nodeStore.nodeSetAllUncompleted();
    nodeStore.nodeAllCleareBuffer();

    // initialize
    console.log('start initialize nodes', nodeStore.nodes);
    for (let i = 0; i < nodeStore.nodes.length; i += 1) {
      const node = nodeStore.nodes[i];
      if (node.type === undefined) {
        continue;
      }
      const behavior = getNodeBehaviorCacheByType(node.type);
      if (behavior.initialize) {
        console.log('start nodes behavior initialize ', {
          hasStart: !!behavior.initialize,
          type: node.type,
        });
        await behavior.initialize(node.id);
      }
    }

    console.log('subscribe');
    const unsubscribe = useProcessStore.subscribe((state) => {
      console.log('process status', state.count, state.processStatus);

      if (state.processStatus !== 'processing') {
        console.log('######### process not processing', state.processStatus);
        unsubscribe();
      }
      if (this.checkCanStartProcess()) {
        console.log('######### progress');
        this.progress();
        return;
      }
      if (this.checkCompletedCurrentIteration()) {
        console.log('######### not completed this iteration');
        const hasNextIteration = this.checkHasNextIteration();
        if (hasNextIteration) {
          console.log('######### process next iteration');
          this.runIterationOnce();
          return;
        }
        console.log('######### process complete');
        this.stop();

        return;
      }

      // debug
      const limit = 50;
      // if (state.count > limit) {
      //   console.log(`######### process count over ${limit}`);
      //   this.stop();
      // }
    });

    console.log('######### do progress one time');
    await this.progress();
  }

  static runNodeBehavior(nodeId: string, nodeBehavior: NodeBehaviorInterface) {
    const nodeStore = useNodeStore.getState();
    nodeStore.nodeSetProcessing(nodeId, true);
    // start date
    const start = new Date();
    nodeBehavior.nodeProcess(nodeId, () => {
      // end date
      const end = new Date();
      const diff = end.getTime() - start.getTime();
      nodeStore.updateNodeData(nodeId, {
        isProcessing: false,
        processTime: diff,
      });
      console.log('#### nodeProcess complete', nodeId, nodeBehavior, diff);
      useProcessStore.getState().progress();
    });
  }

  checkCanStartProcess(): boolean {
    const { nodes } = useNodeStore.getState();

    // make loop of nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type === undefined) {
        console.log('#### node type undefined', node);
        continue;
      }
      if (useNodeStore.getState().nodeGetCompleted(node.id)) {
        continue;
      }
      if (useNodeStore.getState().nodeGetProcessing(node.id)) {
        continue;
      }
      const behavior = getNodeBehaviorCacheByType(node.type);
      const canStart = behavior.canStartProcess(node.id);
      if (canStart) {
        return true;
      }
    }
    return false;
  }

  checkCompletedCurrentIteration(): boolean {
    const { nodes } = useNodeStore.getState();

    console.log('#### checkCompletedCurrentIteration');

    // make loop of nodes
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (node.type === undefined) {
        console.log('#### node type undefined', node);
        continue;
      }
      if (!useNodeStore.getState().nodeGetCompleted(node.id)) {
        return false;
      }
      if (useNodeStore.getState().nodeGetProcessing(node.id)) {
        return false;
      }
    }
    return true;
  }

  progress() {
    const nodeStore = useNodeStore.getState();

    const { nodes } = nodeStore;

    // make loop of nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type === undefined) {
        continue;
      }
      if (nodeStore.nodeGetCompleted(node.id)) {
        continue;
      }
      if (nodeStore.nodeGetProcessing(node.id)) {
        continue;
      }
      const behavior = getNodeBehaviorCacheByType(node.type);
      if (!behavior.canStartProcess(node.id)) {
        continue;
      }
      ProcessController.runNodeBehavior(node.id, behavior);
    }
  }

  checkHasNextIteration(): boolean {
    console.log('#### checkHasNextIteration');

    const { nodes } = useNodeStore.getState();

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type === undefined) {
        continue;
      }
      const behavior = getNodeBehaviorCacheByType(node.type);
      if (behavior.hasNextIteration) {
        const hasNext = behavior.hasNextIteration(node.id);
        if (hasNext) {
          return true;
        }
      }
    }
    return false;
  }

  checkProcessing(): boolean {
    const nodeStore = useNodeStore.getState();
    const { nodes } = useNodeStore.getState();

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type === undefined) {
        continue;
      }
      const processing = nodeStore.nodeGetProcessing(node.id);
      if (processing) {
        return true;
      }
    }
    return false;
  }

  runIterationOnce(): void {
    const { nodes } = useNodeStore.getState();

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      console.log('#### runIterationOnce a', node.id, node.type);
      if (node.type === undefined) {
        continue;
      }
      const behavior = getNodeBehaviorCacheByType(node.type);
      if (!!behavior.hasNextIteration && behavior.hasNextIteration(node.id)) {
        // log
        console.log('#### runIterationOnce', node.id, node.type);
        ProcessController.runNodeBehavior(node.id, behavior);
        break;
      }
    }
  }

  stop() {
    console.log('##### process stop');
    useProcessStore.getState().stop();
  }

  reset() {
    useProcessStore.getState().reset();
  }
}
const processController = new ProcessController();
export default processController;
