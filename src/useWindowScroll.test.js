// import

import {renderHook, fireEvent, waitForTimeout, act} from '@sitearcade/jest-preset/tools';
import {replaceRaf} from 'raf-stub';

import {useWindowScroll} from './useWindowScroll';

// test

describe('useWindowScroll(ms)', () => {
  beforeAll(() => {
    replaceRaf();
  });

  afterEach(() => {
    requestAnimationFrame.reset();
  });

  it('always returns accurate scroll {x,y}', async () => {
    const hook = renderHook(() => useWindowScroll());

    expect(hook.result.current).toStrictEqual({x: 0, y: 0});

    act(() => {
      window.scrollX = 1;
      window.scrollY = 1;
      fireEvent.scroll(window);
    });
    await waitForTimeout(1);
    act(() => {
      requestAnimationFrame.step();
    });

    expect(hook.result.current).toStrictEqual({x: 1, y: 1});
  });
});
