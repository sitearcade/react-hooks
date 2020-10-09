// import

import isEqual from 'dequal/lite';
import {useEffect, useRef, useState, useMemo, useCallback, useContext} from 'react';

// export

export function useCompare(val = null) {
  const ref = useRef(null);

  if (!isEqual(ref.current, val)) {
    ref.current = val;
  }

  return ref.current;
}

export function useCompareSetter(state, setState) {
  return useCallback((v) => (
    isEqual(state, v) ? null : setState(v)
  ), []);
}

// ...

export function useCompareRef(def) {
  return useCompare(useRef(def));
}

export function useCompareEffect(fn, deps) {
  return useEffect(fn, useCompare(deps));
}

export function useCompareMemo(fn, deps) {
  return useMemo(fn, useCompare(deps));
}

export function useCompareCallback(fn, deps) {
  return useCallback(fn, useCompare(deps));
}

export function useCompareContext(ctx) {
  return useContext(useCompare(ctx));
}

export function useCompareState(init) {
  const [state, setState] = useState(init);

  return [state, useCompareSetter(state, setState)];
}
