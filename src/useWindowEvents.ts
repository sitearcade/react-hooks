// import

import {useEffect} from 'react';
import {useRafState} from 'react-use';

import {debounce} from './useDebounce';

// vars

const listenerOpts = {capture: false, passive: true};

// export

export function useWindowEvents<T>(
  fn: (e?: Event) => T,
  events: string[] = [],
  ms: number = 0,
) {
  const [state, setState] = useRafState(() => fn());

  useEffect(() => {
    const handler = debounce((e) => setState(fn(e)), ms, ms * 10);

    events.map((e) => window.addEventListener(e, handler, listenerOpts));

    return () => {
      events.map((e) => window.removeEventListener(e, handler));
      handler.cancel();
    };
  }, [fn, events.join('-'), ms]);

  return state;
}
