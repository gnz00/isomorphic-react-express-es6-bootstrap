/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

export const addEventListener = (node, event, listener) => {
  if (node.addEventListener) {
    node.addEventListener(event, listener, false);
  } else {
    node.attachEvent('on' + event, listener);
  }
}

export const removeEventListener = (node, event, listener) => {
  if (node.removeEventListener) {
    node.removeEventListener(event, listener, false);
  } else {
    node.detachEvent('on' + event, listener);
  }
}

export default {
  addEventListener,
  removeEventListener
};

