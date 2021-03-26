// import

import {useRef, useCallback, useEffect, useState} from 'react';

import {useLatestRef} from './useLatest';

// types

type DeboundedFunc = (...args: any[]) => void;

export interface DebounceHandler {
  (...args: any[]): void;
  cancel: () => void;
}
export interface MaybeDebounceHandler {
  (...args: any[]): void;
  cancel?: () => void;
}

// fns

export function debounce<T extends DeboundedFunc>(fn: T, min = 0, max = 0) {
  let id = 0;
  let dead = false;
  let lastExec = 0;

  function handler(...args: Parameters<T>) {
    if (dead) {
      return;
    }

    const elapsed = Date.now() - lastExec;
    const minDiff = Math.max(0, min - elapsed);
    const maxDiff = Math.max(0, max - elapsed);
    const delay = !id || max <= 0 ? minDiff :
      maxDiff > min ? min : maxDiff;

    clearTimeout(id);

    id = window.setTimeout(() => {
      fn(...args);
      lastExec = Date.now();
      id = 0;
    }, delay);
  }

  handler.cancel = () => {
    clearTimeout(id);
    dead = true;
  };

  return handler as DebounceHandler;
}

// export

export function useDebounce(
  fn: DeboundedFunc,
  wait = 0,
  leading = false,
) {
  const func = useLatestRef(fn);
  const id = useRef<number>(0);

  useEffect(() => () => {
    clearTimeout(id.current);
    id.current = 0;
  }, [wait, leading]);

  return useCallback((...args) => {
    if (id.current === 0 && leading) {
      id.current = window.setTimeout(() => {
        id.current = 0;
      }, wait);

      return func.current(...args);
    }

    clearTimeout(id.current);

    id.current = window.setTimeout(() => {
      id.current = 0;
      func.current(...args);
    }, wait);
  }, [wait, leading]);
}

export function useDebounceState<T extends any>(
  initial: T,
  wait?: number,
  leading?: boolean,
) {
  const [state, setState] = useState<T>(initial);

  return [state, useDebounce(setState, wait, leading)];
}
