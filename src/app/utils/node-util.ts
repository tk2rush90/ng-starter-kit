/** Class that contains utility methods for Node */
export class NodeUtil {
  /**
   * Get status of having `targetNode` in `parentNode`.
   * It searches `targetNode` recursively.
   * @param parentNode - Parent node to check containing status of `targetNode`.
   * @param targetNode - Target node to search.
   * @return Having status of `targetNode` in `parentNode`.
   */
  static containsTargetNode(parentNode: Node, targetNode: Node): boolean {
    // Set initial status.
    let hasTargetNode = false;

    // Loop children.
    for (let i = 0; i < parentNode.childNodes.length; i++) {
      const _childNode = parentNode.childNodes[i];

      if (_childNode === targetNode) {
        hasTargetNode = true;
      } else if (_childNode.hasChildNodes()) {
        hasTargetNode = NodeUtil.containsTargetNode(_childNode, targetNode);
      }

      if (hasTargetNode) {
        break;
      }
    }

    return hasTargetNode;
  }
}
