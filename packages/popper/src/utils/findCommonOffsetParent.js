import isOffsetContainer from './isOffsetContainer';
import getRoot from './getRoot';
import getOffsetParent from './getOffsetParent';
import getParentNode from './getParentNode';

/**
 * Finds the offset parent common to the two provided nodes/references
 * @method
 * @memberof Popper.Utils
 * @argument {Element|Object} element1
 * @argument {Element|Object} element2
 * @returns {Element} common offset parent
 */
export default function findCommonOffsetParent(element1, element2) {
  // This is needed in case one of the elements isn't defined or if one of the "elements" is a reference object.
  if (!element2 || !element2.nodeType) {
    if (element1 && element1.nodeType) {
      element2 = getParentNode(element1);
    } else {
      return document.documentElement;
    }
  } else if (!element1 || !element1.nodeType) {
    element1 = getParentNode(element2);
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  const order =
    element1.compareDocumentPosition(element2) &
    Node.DOCUMENT_POSITION_FOLLOWING;
  const start = order ? element1 : element2;
  const end = order ? element2 : element1;

  // Get common ancestor container
  const range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  const { commonAncestorContainer } = range;

  // Both nodes are inside #document
  if (
    (element1 !== commonAncestorContainer &&
      element2 !== commonAncestorContainer) ||
    start.contains(end)
  ) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  const element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}
