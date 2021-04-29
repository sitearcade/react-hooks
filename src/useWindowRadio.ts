// import

import type {Ref} from 'react';
import {useRef, useEffect, useCallback} from 'react';

// types

export type OnMessage<O = unknown> = (data: O, event: MessageEvent) => void;
export type PostMessage = <P = unknown>(msg: P) => void;

// vars

const listenerOpts = {capture: false, passive: true};

// export

export function useWindowRadio<O>(
  target: Window,
  origin: string,
  onMessage?: OnMessage<O>,
) {
  useEffect(() => {
    const handler = (event: MessageEvent) => (
      origin === '*' || event.origin === origin ?
        onMessage?.(event.data, event) : null
    );

    window.addEventListener('message', handler, listenerOpts);

    return () => window.removeEventListener('message', handler);
  }, [target, origin, onMessage]);

  return useCallback<PostMessage>(
    (msg) => target.postMessage(msg, origin),
    [target, origin, onMessage],
  );
}

export function useFrameRadio<O>(
  origin: string,
  onMessage?: OnMessage<O>,
): [Ref<HTMLIFrameElement>, PostMessage] {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const target = frameRef.current?.contentWindow ?? window;

  return [frameRef, useWindowRadio(target, origin, onMessage)];
}

