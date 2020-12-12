// import

import {useRef, useCallback, useEffect, useState} from 'react';

import {useLatestRef} from './useLatest';

// export

export function useThrottle(fn, wait = 0, leading = false) {
  const func = useLatestRef(fn);
  const prev = useRef(0);
  const id = useRef(null);

  useEffect(() => () => {
    clearTimeout(id.current);
    prev.current = 0;
  }, [wait, leading]);

  return useCallback((...args) => {
    const now = Date.now();
    const current = prev.current;

    const call = () => {
      prev.current = now;
      clearTimeout(id.current);
      func.current(...args);
    };

    if (leading && current === 0) {
      return call();
    }

    if (now - current > wait) {
      if (current > 0) {
        return call();
      }

      prev.current = now;
    }

    clearTimeout(id.current);

    id.current = setTimeout(() => {
      call();
      prev.current = 0;
    }, wait);
  }, [wait, leading]);
}

export function useThrottleState(initial, wait, leading) {
  const [state, setState] = useState(initial);

  return [state, useThrottle(setState, wait, leading)];
}
