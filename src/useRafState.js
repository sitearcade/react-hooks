// import

import {useRef, useState, useCallback} from 'react';

import {useUnmountEffect} from './useLifecycle';

// hook

export function useRafState(initialState) {
  const frame = useRef(0);
  const [state, setState] = useState(initialState);

  const setRafState = useCallback((value) => {
    cancelAnimationFrame(frame.current);

    frame.current = requestAnimationFrame(() => {
      setState(value);
    });
  }, []);

  useUnmountEffect(() => {
    cancelAnimationFrame(frame.current);
  });

  return [state, setRafState];
}
