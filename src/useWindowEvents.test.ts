// import

import {renderHook, fireEvent, act, waitForTimeout} from '@sitearcade/jest-preset/tools';
import fakeRaf from 'fake-raf';

import {useWindowEvents} from './useWindowEvents';

// test

describe('useWindowEvents(onEvent, events, ms)', () => {
  beforeAll(() => {
    fakeRaf.use();
  });

  afterEach(() => {
    fakeRaf.restore();
  });

  it('calls onEvent immediately, then on event trigger', async () => {
    const onEvent = jest.fn();
    renderHook(() => useWindowEvents(onEvent, ['scroll']));

    expect(onEvent).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.wheel(window);
      fireEvent.scroll(window);
      fakeRaf.step();
    });
    await waitForTimeout(1);

    expect(onEvent).toHaveBeenCalledTimes(2);
  });

  it('binds/unbinds window listener to listed events', async () => {
    let event = 'scroll';
    const onEvent = jest.fn();
    const hook = renderHook(() => useWindowEvents(onEvent, [event]));

    expect(onEvent).toHaveBeenCalledTimes(1);

    event = 'wheel';
    hook.rerender();

    expect(onEvent).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.scroll(window);
      fakeRaf.step();
    });
    await waitForTimeout(1);

    expect(onEvent).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.wheel(window);
      fakeRaf.step();
    });
    await waitForTimeout(1);

    expect(onEvent).toHaveBeenCalledTimes(2);
  });

  it('can throttle frequent event triggers', async () => {
    const onEvent = jest.fn();
    renderHook(() => useWindowEvents(onEvent, ['scroll'], 1));

    expect(onEvent).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.scroll(window);
      fireEvent.scroll(window);
      fireEvent.scroll(window);
      fireEvent.scroll(window);
      fireEvent.scroll(window);
      fakeRaf.step();
    });
    await waitForTimeout(1);

    expect(onEvent).toHaveBeenCalledTimes(2);
  });

  it('supports null events list', () => {
    const onEvent = jest.fn();
    const hook = renderHook(() => useWindowEvents(onEvent));

    expect(hook.result.error).toBeUndefined();
  });
});
