// import

import {useRef, useEffect, useCallback} from 'react';

// vars

const listenerOpts = {capture: false, passive: true};

// export

export function useWindowRadio(target, origin, onMessage) {
  useEffect(() => {
    if (!target || !window) {
      return;
    }

    const handler = (event) => (
      origin === '*' || event.origin === origin ?
        onMessage(event.data, event) : null
    );

    window.addEventListener('message', handler, listenerOpts);

    return () => window.removeEventListener('message', handler);
  }, [target, origin, onMessage]);

  return useCallback((msg) => target?.postMessage(msg, origin), [target, origin]);
}

export function useFrameRadio(origin, onMessage) {
  const frameRef = useRef(null);
  const target = frameRef.current?.contentWindow ?? null;

  return [frameRef, useWindowRadio(target, origin, onMessage)];
}
