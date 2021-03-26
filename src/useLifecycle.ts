// import

import type {DependencyList, EffectCallback} from 'react';
import {useEffect, useCallback, useRef} from 'react';

// fns

const noop: () => void = () => undefined;

// refs

export function useIsMountRef() {
  const ref = useRef(true);

  useEffect(() => {
    ref.current = false;
  }, []);

  return ref;
}

export function useIsMount() {
  return useIsMountRef().current;
}

export function useIsUpdateRef() {
  const ref = useRef(false);

  useEffect(() => {
    ref.current = true;
  }, []);

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

    return () => {
      ref.current = false;
    };
  }, []);

  return useCallback(() => ref.current, []);
}

// effects

export function useMountEffect(
  mountFn: EffectCallback = noop,
) {
  useEffect(mountFn, []);
}

export function useUpdateEffect(
  updateFn: EffectCallback = noop,
  deps?: DependencyList,
) {
  const isUpdate = useIsUpdate();
  const ref = useRef(updateFn);
  ref.current = updateFn;

  useEffect(() => {
    if (isUpdate) {
      ref.current();
    }
  }, deps);
}

export function useUnmountEffect(
  unmountFn: ReturnType<EffectCallback> = noop,
) {
  const ref = useRef(unmountFn);
  ref.current = unmountFn;

  useEffect(() => ref.current, []);
}

export function useLifecycleEffect(
  mountFn?: EffectCallback,
  unmountFn?: ReturnType<EffectCallback>,
) {
  useMountEffect(mountFn);
  useUnmountEffect(unmountFn);
}
