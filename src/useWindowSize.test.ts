// import

import {renderHook, waitForTimeout, act} from '@sitearcade/jest-preset/tools';
import fakeRaf from 'fake-raf';

import {useWindowSize} from './useWindowSize';

// test

describe('useWindowSize(ms)', () => {
  beforeAll(() => {
    fakeRaf.use();
  });

  afterEach(() => {
    fakeRaf.restore();
  });

  it('always returns accurate scroll {x,y}', async () => {
    const hook = renderHook(() => useWindowSize());

    expect(hook.result.current).toStrictEqual({width: 1024, height: 768});

    act(() => {
      // @ts-expect-error Mocking window
      window.innerWidth = 1;
      // @ts-expect-error Mocking window
      window.innerHeight = 1;
      window.dispatchEvent(new Event('resize'));
    });

    await waitForTimeout(1);

    act(() => {
      fakeRaf.step();
    });

    expect(hook.result.current).toStrictEqual({width: 1, height: 1});
  });
});
