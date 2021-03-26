// import

import type {Ref} from 'react';
import {useRef, useEffect, useCallback} from 'react';

// types

export type PostMessage = <T>(msg: T) => void;
export type OnMessage = <T>(data: T, event: MessageEvent<T>) => void;

// vars

const listenerOpts = {capture: false, passive: true};

// export

export function useWindowRadio(
  target: Window,
  origin: string,
  onMessage: OnMessage,
) {
  useEffect(() => {
    if (!target || !window) {
      return;
    }

    const handler = <U>(event: MessageEvent<U>) => (
      origin === '*' || event.origin === origin ?
        onMessage(event.data, event) : null
    );

    window.addEventListener('message', handler, listenerOpts);

    return () => window.removeEventListener('message', handler);
  }, [target, origin, onMessage]);

  return useCallback<PostMessage>((msg) => target?.postMessage(msg, origin), [target, origin]);
}

export function useFrameRadio(
  origin: string,
  onMessage: OnMessage,
): [Ref<HTMLIFrameElement>, PostMessage] {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const target = frameRef.current?.contentWindow ?? window;

  return [frameRef, useWindowRadio(target, origin, onMessage)];
}
