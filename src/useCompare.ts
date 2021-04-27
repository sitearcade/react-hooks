// import

import {dequal} from 'dequal/lite';
import type {EffectCallback, DependencyList, Dispatch, SetStateAction} from 'react';
import {useEffect, useRef, useState, useMemo, useCallback} from 'react';

// export

export function useCompare<T>(val: T) {
  const ref = useRef<T>(val);

  if (!dequal(ref.current, val)) {
    ref.current = val;
  }

  return ref.current;
}

export function useCompareSetter<T>(
  state: T,
  setState: Dispatch<SetStateAction<T>>,
) {
  return useCallback((v) => (
    dequal(state, v) ? null : setState(v)
  ), []);
}

// ...

export const useCompareRef = useCompare;

export function useCompareEffect(fn: EffectCallback, deps) {
  return useEffect(fn, useCompare(deps));
}

export function useCompareMemo<T>(fn: () => T, deps) {
  return useMemo(fn, useCompare(deps));
}

export function useCompareCallback<T>(
  fn: () => T,
  deps: DependencyList = [],
) {
  return useCallback(fn, useCompare(deps));
}

export function useCompareState<T>(init: T) {
  const [state, setState] = useState(init);

  return [state, useCompareSetter(state, setState)];
}
