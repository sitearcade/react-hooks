// import

import {renderHook} from '@sitearcade/jest-preset/tools';

import {useIsMount, useIsUpdate, useIsMounted, useUpdateEffect, useLifecycleEffect} from './useLifecycle';

describe('useIsMount()', () => {
  it('accurately describes state of component', () => {
    const hook = renderHook(() => useIsMount());

    expect(hook.result.current).toBeTrue();

    hook.rerender();

    expect(hook.result.current).toBeFalse();

    hook.rerender();

    expect(hook.result.current).toBeFalse();
  });
});

describe('useIsUpdate()', () => {
  it('accurately describes state of component', () => {
    const hook = renderHook(() => useIsUpdate());

    expect(hook.result.current).toBeFalse();

    hook.rerender();

    expect(hook.result.current).toBeTrue();

    hook.rerender();

    expect(hook.result.current).toBeTrue();
  });
});

describe('useIsMounted()', () => {
  it('accurately describes state of component', () => {
    const hook = renderHook(() => useIsMounted());

    expect(hook.result.current()).toBeTrue();

    hook.rerender();

    expect(hook.result.current()).toBeTrue();

    hook.unmount();

    expect(hook.result.current()).toBeFalse();
  });
});

describe('useUpdateEffect(onUpdate, deps)', () => {
  it('runs callbacks at correct times', () => {
    const onUpdate = jest.fn();
    const hook = renderHook(() => useUpdateEffect(onUpdate));

    expect(onUpdate).toHaveBeenCalledTimes(0);

    hook.rerender();

    expect(onUpdate).toHaveBeenCalledTimes(1);

    hook.unmount();

    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  it('will limit rerenders to dep changes after mount', () => {
    let id = 0;
    const onUpdate = jest.fn();
    const hook = renderHook(() => useUpdateEffect(onUpdate, [id]));

    expect(onUpdate).toHaveBeenCalledTimes(0);

    hook.rerender();

    expect(onUpdate).toHaveBeenCalledTimes(0);

    id = 1;
    hook.rerender();

    expect(onUpdate).toHaveBeenCalledTimes(1);

    hook.unmount();

    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  it('allows null callback', () => {
    const hook = renderHook(() => useUpdateEffect());

    expect(hook.result.error).toBeUndefined();
  });
});

describe('useLifecycleEffect(onMount, onUnmount)', () => {
  it('runs callbacks at correct times', () => {
    const onMount = jest.fn();
    const onUnmount = jest.fn();
    const hook = renderHook(() => useLifecycleEffect(onMount, onUnmount));

    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onUnmount).toHaveBeenCalledTimes(0);

    hook.rerender();

    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onUnmount).toHaveBeenCalledTimes(0);

    hook.unmount();

    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onUnmount).toHaveBeenCalledTimes(1);
  });

  it('allows null callbacks', () => {
    const hook = renderHook(() => useLifecycleEffect());

    expect(hook.result.error).toBeUndefined();
  });
});
