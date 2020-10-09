// import

import {useState, useCallback} from 'react';

import {useMountEffect} from './useLifecycle';

// lifecyle

export function useForceUpdate() {
  const [, set] = useState(Date.now());

  return useCallback(() => set(Date.now()), []);
}

export function useUpdateOnMount() {
  const forceUpdate = useForceUpdate();

  useMountEffect(forceUpdate);

  return forceUpdate;
}
