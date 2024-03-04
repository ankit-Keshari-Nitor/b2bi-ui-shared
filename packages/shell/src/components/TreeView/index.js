/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import TreeView from './TreeView';
import TreeNode from './TreeNode';
import { SFGTreeView } from './SFGTreeView'

TreeView.TreeNode = TreeNode;

export { TreeNode as CDSTreeNode, TreeView as CDSTreeView, SFGTreeView as TreeView };
export default TreeView;