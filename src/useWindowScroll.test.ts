// import

import {renderHook, fireEvent, waitForTimeout, act} from '@sitearcade/jest-preset/tools';
import fakeRaf from 'fake-raf';

import {useWindowScroll} from './useWindowScroll';

// test

describe('useWindowScroll(ms)', () => {
  beforeAll(() => {
    fakeRaf.use();
  });

  afterEach(() => {
    fakeRaf.restore();
  });

  it('always returns accurate scroll {x,y}', async () => {
    const hook = renderHook(() => useWindowScroll());

    expect(hook.result.current).toStrictEqual({x: 0, y: 0});

    act(() => {
      // @ts-expect-error Mocking window
      window.pageXOffset = 1;
      // @ts-expect-error Mocking window
      window.pageYOffset = 1;
      fireEvent.scroll(window);
    });

    await waitForTimeout(1);

    act(() => {
      fakeRaf.step();
    });

    expect(hook.result.current).toStrictEqual({x: 1, y: 1});
  });
});
