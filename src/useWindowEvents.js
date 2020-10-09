// import

import {useEffect} from 'react';

import {useRafState} from './useRafState';
import {throttle} from './utils';

// vars

const listenerOpts = {capture: false, passive: true};

// export

export function useWindowEvents(fn, events = [], ms = 0) {
  const [state, setState] = useRafState(() => fn());

  useEffect(() => {
    const handler = throttle((e) => setState(fn(e)), ms, ms * 10);

    events.map((e) => window.addEventListener(e, handler, listenerOpts));

    return () => {
      events.map((e) => window.removeEventListener(e, handler));
      handler.cancel();
    };
  }, [fn, events.join('-'), ms]);

  return state;
}
