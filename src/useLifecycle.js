// import

import {useEffect, useCallback, useRef} from 'react';

// fns

const noop = () => undefined;

// state

export function useIsMount() {
  const firstMount = useRef(true);

  if (firstMount.current) {
    firstMount.current = false;

    return true;
  }

  return false;
}

export function useIsMounted() {
  const mountRef = useRef(false);

  useEffect(() => {
    mountRef.current = true;

    return () => {
      mountRef.current = false;
    };
  });

  return useCallback(() => mountRef.current, []);
}

// effects

export function useMountEffect(mountFn = noop) {
  useEffect(mountFn, []);
}

export function useUpdateEffect(updateFn = noop, deps = null) {
  const isMount = useIsMount();

  useEffect(() => {
    if (!isMount) {
      return updateFn();
    }
  }, deps);
}

export function useUnmountEffect(unmountFn = noop) {
  const unmountRef = useRef(unmountFn);
  unmountRef.current = unmountFn;

  useEffect(() => unmountRef.current, []);
}

export function useLifecycleEffect(mountFn, unmountFn) {
  useMountEffect(mountFn);
  useUnmountEffect(unmountFn);
}
