// import

import {useEffect, useRef} from 'react';

import throttle from './utils';

// vars

const defOpts = {capture: true, passive: false};

// export

export function useEvents(fn, events = [], opts = defOpts, ms = 0) {
  const eventRef = useRef(null);

  useEffect(() => {
    if (!eventRef.current) {
      return;
    }

    const handler = ms ? throttle(fn, ms, ms * 10) : fn;
    events.map((e) => eventRef.current.addEventListener(e, handler, opts));

    return () => {
      events.map((e) => eventRef.current.removeEventListener(e, handler));
      handler.cancel?.();
    };
  }, [fn, events, ms]);

  return eventRef;
}

export function useCapture(fn, events) {
  return useEvents((e) => (
    e.defaultPrevented || (fn(e) && e.preventDefault())
  ), events);
}
