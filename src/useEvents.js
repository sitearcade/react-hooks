// import

import {useEffect, useState, useCallback} from 'react';

import {debounce} from './useDebounce';

// vars

const defOpts = {capture: true, passive: false};

// export

export function useEvents(fn, events = [], opts = defOpts, ms = 0) {
  const [domNode, setDomNode] = useState(null);

  useEffect(() => {
    if (!domNode) {
      return;
    }

    const handler = ms ? debounce(fn, ms, ms * 10) : fn;
    events.map((e) => domNode.addEventListener(e, handler, opts));

    return () => {
      events.map((e) => domNode.removeEventListener(e, handler));
      handler.cancel?.();
    };
  }, [fn, events, ms, domNode]);

  return useCallback((ref) => setDomNode(ref), []);
}

export function useCapture(fn, events) {
  return useEvents((e) => (
    e.defaultPrevented || (fn(e) && e.preventDefault())
  ), events);
}
