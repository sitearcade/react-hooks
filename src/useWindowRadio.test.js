// import

import {renderHook, fireEvent, act, render} from '@sitearcade/jest-preset/tools';

import {useWindowRadio, useFrameRadio} from './useWindowRadio';

// vars

const testOrigin = 'http://example.com';

// test

beforeAll(() => {
  window.postMessage = (data, origin) =>
    fireEvent(window, new MessageEvent('message', {data, origin}));
});

describe('useWindowRadio(target, origin, onMessage)', () => {
  it('binds to target window', () => {
    const onMessage = jest.fn();
    let postMessage = null;

    renderHook(() => {
      postMessage = useWindowRadio(window, '*', onMessage);
    });

    act(() => {
      fireEvent(window, new MessageEvent('message', {data: 'test'}));
    });

    expect(postMessage).toBeFunction();
    expect(onMessage).toHaveBeenCalledWith('test', expect.anything());
  });

  it('filters by origin, if specified', () => {
    const onMessage = jest.fn();
    let postMessage = null;

    renderHook(() => {
      postMessage = useWindowRadio(window, testOrigin, onMessage);
    });

    act(() => {
      fireEvent(window, new MessageEvent('message', {data: 'test'}));
      postMessage('test');
    });

    expect(onMessage).toHaveBeenCalledTimes(1);
  });
});

describe('useFrameRadio(origin, onMessage)', () => {
  it('binds to ref target `node.contentWindow`', async () => {
    const onWindowMessage = jest.fn();
    const onIframeMessage = jest.fn();
    let frameRef = null;
    let postMessage = null;

    const Comp = () => {
      [frameRef, postMessage] = useFrameRadio(testOrigin, onWindowMessage);

      return (<iframe ref={frameRef} src={testOrigin} title="iframe" />);
    };

    const dom = render(<Comp />);
    dom.rerender(<Comp />);
    const iframe = await dom.findByTitle('iframe');

    iframe.contentWindow.addEventListener('message', onIframeMessage, false);

    iframe.contentWindow.postMessage = (data) =>
      fireEvent(iframe.contentWindow, new MessageEvent('message', {
        data, origin: 'http://localhost',
      }));

    act(() => {
      fireEvent(window, new MessageEvent('message', {
        data: 'test', origin: testOrigin,
      }));
      postMessage('test');
    });

    expect(postMessage).toBeFunction();
    expect(onWindowMessage).toHaveBeenCalledWith('test', expect.anything());
    expect(onIframeMessage).toHaveBeenCalled();
  });
});
