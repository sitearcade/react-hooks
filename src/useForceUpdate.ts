// import

import {useReducer} from 'react';

import {useMountEffect} from './useLifecycle';

// fns

const updateReducer = (num: number) => num++ % 1_000;

// lifecyle

export function useForceUpdate() {
  const [, update] = useReducer(updateReducer, 0);

  return update;
}

export function useUpdateOnMount() {
  const forceUpdate = useForceUpdate();

  useMountEffect(forceUpdate);

  return forceUpdate;
}
