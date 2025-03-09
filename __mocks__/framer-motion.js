import React from 'react';

const motion = {
  div: (props) => <div {...props} />,
  button: (props) => <button {...props} />,
};

module.exports = {
  AnimatePresence: ({ children }) => children,
  motion,
  useReducedMotion: () => false,
};
