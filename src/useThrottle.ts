// import

import {useRef, useCallback, useEffect, useState} from 'react';

import {useLatestRef} from './useLatest';

// type

type ThrottledFunc = (...args: any[]) => void;

// export

export function useThrottle<T extends ThrottledFunc>(
  fn: T,
  wait = 0,
  leading = false,
) {
  const func = useLatestRef(fn);
  const prev = useRef(0);
  const id = useRef(0);

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

    id.current = window.setTimeout(() => {
      call();
      prev.current = 0;
    }, wait);
  }, [wait, leading]);
}

export function useThrottleState<T extends any>(
  initial: T,
  wait?: number,
  leading?: boolean,
) {
  const [state, setState] = useState(initial);

  return [state, useThrottle(setState, wait, leading)];
}
