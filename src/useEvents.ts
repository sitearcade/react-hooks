// import

import type {Ref} from 'react';
import {useEffect, useState, useCallback} from 'react';

import type {MaybeDebounceHandler} from './useDebounce';
import {debounce} from './useDebounce';

// vars

const defOpts = {
  capture: true,
  passive: false,
};

// export

export function useEvents(
  fn?: (event: Event) => void,
  events: string[] = [],
  opts = defOpts,
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
  }, [fn, events, ms, domNode]);

  return useCallback((ref) => setDomNode(ref), []);
}

export function useCapture(fn?: (event: Event) => void, events?: string[]) {
  return useEvents((e: Event) => (
    e.defaultPrevented || (fn?.(e) && e.preventDefault())
  ), events);
}
