// import

import type {Ref} from 'react';
import {useRef, useEffect, useCallback} from 'react';

// types

export type OnMessage<T = unknown> = (data: T, event: MessageEvent) => void;
export type PostMessage<U = unknown> = (msg: U) => void;

// vars

const listenerOpts = {capture: false, passive: true};

// export

export function useWindowRadio<T, U>(
  target: Window,
  origin: string,
  onMessage?: OnMessage<T>,
) {
  useEffect(() => {
    const handler = (event: MessageEvent) => (
      origin === '*' || event.origin === origin ?
        onMessage?.(event.data, event) : null
    );

    window.addEventListener('message', handler, listenerOpts);

    return () => window.removeEventListener('message', handler);
  }, [target, origin, onMessage]);

  return useCallback<PostMessage<U>>(
    (msg) => target.postMessage(msg, origin),
    [target, origin, onMessage],
  );
}

export function useFrameRadio<T, U>(
  origin: string,
  onMessage: OnMessage<T>,
): [Ref<HTMLIFrameElement>, PostMessage<U>] {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const target = frameRef.current?.contentWindow ?? window;

  return [frameRef, useWindowRadio(target, origin, onMessage)];
}
