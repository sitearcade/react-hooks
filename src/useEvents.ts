// import

import type {Ref} from 'react';
import {useEffect, useState, useCallback} from 'react';

import type {MaybeDebounceHandler} from './useDebounce';
import {debounce} from './useDebounce';

// types

type EventOpts = AddEventListenerOptions | EventListenerOptions;

// vars

const defOpts = {
  once: false,
  capture: true,
  passive: false,
};

// export

export function useEvents<E extends Event = Event>(
  fn?: (event: E) => void,
  events: string[] = [],
  opts: EventOpts = defOpts,
  ms = 0,
): Ref<HTMLElement> {
  const [domNode, setDomNode] = useState<HTMLElement>();

  useEffect(() => {
    if (!domNode || !fn) {
      return;
    }

    const handler: MaybeDebounceHandler = ms ? debounce(fn, ms, ms * 10) : fn;

    events.map((e) => domNode.addEventListener(e, handler, opts));

    return () => {
      events.map((e) => domNode.removeEventListener(e, handler));
      handler.cancel?.();
    };
  }, [fn, events, ms, domNode, opts]);

  return useCallback((ref) => setDomNode(ref), []);
}
