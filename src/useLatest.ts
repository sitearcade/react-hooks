// import

import type {DependencyList} from 'react';
import {useRef, useEffect, useState} from 'react';

// export

export function useLatestRef<T>(val: T, deps?: DependencyList) {
  const ref = useRef<T>(val);

  useEffect(() => {
    ref.current = val;
  }, deps);

  return ref;
}

export function useLatestState<T>(val: T | (() => T), deps?: DependencyList) {
  const [state, setState] = useState(val);

  useEffect(() => setState(val), deps);

  return state;
}
