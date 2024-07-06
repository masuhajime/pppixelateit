import { useMemo } from "react";
import { nodeDefineMap } from "../flows/nodes";

export const useMemoNodeDefine = (nodeName: string) => {
  return useMemo(() => {
    const define = nodeDefineMap[nodeName];
    if (!define) {
      throw new Error(`Node define not found for ${nodeName}`);
    }
    return define;
  }, [nodeName]);
};
