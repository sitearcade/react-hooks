// import

import {renderHook, waitForTimeout} from '@sitearcade/jest-preset/tools';

import {useDebounce, debounce} from './useDebounce';

// test

describe('debounce(fn, min, max)', () => {
  it('returns handler(...args) and handler.cancel()', async () => {
    const spy = jest.fn();
    const handler = debounce(spy);

    expect(handler).toBeInstanceOf(Function);
    expect(handler.cancel).toBeInstanceOf(Function);

    handler('test');
    handler('test');
    await waitForTimeout();

    expect(spy).toHaveBeenCalledWith('test');
    expect(spy).toHaveBeenCalledTimes(1);

    await waitForTimeout();

    expect(spy).toHaveBeenCalledTimes(1);

    handler('test');
    handler.cancel();
    handler('test');
    await waitForTimeout();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('useDebounce(fn, wait, leading)', () => {
  it('returns debounced function and updates with args', async () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const {rerender, result} = renderHook(({spy}) => useDebounce(spy), {initialProps: {spy: spy1}});
    const handler = result.current;

    expect(handler).toBeInstanceOf(Function);

    handler('test');
    handler('test');
    await waitForTimeout();

    expect(spy1).toHaveBeenCalledWith('test');
    expect(spy1).toHaveBeenCalledTimes(1);

    await waitForTimeout();

    expect(spy1).toHaveBeenCalledTimes(1);

    handler('test');
    rerender({spy: spy2});
    handler('test');
    await waitForTimeout();

    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledTimes(1);
  });
});
