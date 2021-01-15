// import

import {useEffect, useCallback, useRef} from 'react';

// fns

const noop = () => undefined;

// refs

export function useIsMountRef() {
  const ref = useRef(true);

  useEffect(() => (ref.current = false), []);

  return ref;
}

export function useIsMount() {
  return useIsMountRef().current;
}

export function useIsUpdateRef() {
  const ref = useRef(false);

  useEffect(() => (ref.current = true), []);

  return ref;
}

export function useIsUpdate() {
  return useIsUpdateRef().current;
}

// state

export function useIsMounted() {
  const ref = useRef(false);

  useEffect(() => {
    ref.current = true;

    return () => (ref.current = false);
  }, []);

  return useCallback(() => ref.current, []);
}

// effects

export function useMountEffect(mountFn = noop) {
  useEffect(mountFn, []);
}

export function useUpdateEffect(updateFn = noop, deps = null) {
  const isUpdate = useIsUpdate();
  const ref = useRef(updateFn);
  ref.current = updateFn;

  useEffect(() => isUpdate && ref.current(), deps);
}

export function useUnmountEffect(unmountFn = noop) {
  const ref = useRef(unmountFn);
  ref.current = unmountFn;

  useEffect(() => ref.current, []);
}

export function useLifecycleEffect(mountFn, unmountFn) {
  useMountEffect(mountFn);
  useUnmountEffect(unmountFn);
}
