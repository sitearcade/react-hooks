// import

import {useRef, useCallback} from 'react';

// fns

export const getPosition = (el, pos = {x: 0, y: 0}) => {
  const newPos = {
    x: pos.x + el.offsetLeft - el.scrollLeft + el.clientLeft,
    y: pos.y + el.offsetTop - el.scrollTop + el.clientTop,
  };

  return el.offsetParent ? getPosition(el.offsetParent, newPos) : newPos;
};

// hook

export function useGetPosition() {
  const ref = useRef(null);
  const getPos = useCallback(() => (ref.current ? getPosition(ref.current) : null), []);

  return [ref, getPos];
}
