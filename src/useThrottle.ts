// import

import {useRef, useCallback, useEffect, useState} from 'react';

// type

type Func = (...args: any[]) => void;

// export

export function useThrottle<T extends Func>(
  fn: T,
  wait = 0,
  leading = false,
) {
  const func = useRef(fn);
  func.current = fn;
  const prev = useRef(0);
  const id = useRef(0);

  useEffect(() => () => {
    clearTimeout(id.current);
    prev.current = 0;
  }, [wait, leading]);

  return useCallback((...args: Parameters<T>) => {
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

export function useThrottleState<T>(
  initial: T,
  wait?: number,
  leading?: boolean,
) {
  const [state, setState] = useState<T>(initial);

  return [state, useThrottle(setState, wait, leading)];
}
