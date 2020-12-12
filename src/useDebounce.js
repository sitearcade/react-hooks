// import

import {useRef, useCallback, useEffect, useState} from 'react';

import {useLatestRef} from './useLatest';

// fns

export function debounce(fn, min = 0, max = 0) {
  let id = null;
  let dead = false;
  let lastExec = 0;

  function handler(...args) {
    if (dead) {
      return;
    }

    const elapsed = Date.now() - lastExec;
    const minDiff = Math.max(0, min - elapsed);
    const maxDiff = Math.max(0, max - elapsed);
    const delay = !id || max <= 0 ? minDiff :
      maxDiff > min ? min : maxDiff;

    clearTimeout(id);

    id = setTimeout(() => {
      fn(...args);
      lastExec = Date.now();
      id = null;
    }, delay);
  }

  handler.cancel = () => {
    clearTimeout(id);
    dead = true;
  };

  return handler;
}

// export

export function useDebounce(fn, wait = 0, leading = false) {
  const func = useLatestRef(fn);
  const id = useRef(null);

  useEffect(() => () => {
    clearTimeout(id.current);
    id.current = null;
  }, [wait, leading]);

  return useCallback((...args) => {
    if (id.current === null && leading) {
      id.current = setTimeout(() => {
        id.current = null;
      }, wait);

      return func.current(...args);
    }

    clearTimeout(id.current);

    id.current = setTimeout(() => {
      id.current = null;
      func.current(...args);
    }, wait);
  }, [wait, leading]);
}

export function useDebounceState(initial, wait, leading) {
  const [state, setState] = useState(initial);

  return [state, useDebounce(setState, wait, leading)];
}
