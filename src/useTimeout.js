// import

import {useEffect, useRef} from 'react';

// vars

const noop = () => null;

// hooks

export function useTimeoutEffect(timeoutFn = noop, ms = 0) {
  const timeout = useRef();
  const callback = useRef(timeoutFn);

  useEffect(() => {
    callback.current = timeoutFn;
  }, [timeoutFn]);

  useEffect(() => {
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      callback.current();
    }, ms);

    return () => clearTimeout(timeout.current);
  }, [ms]);
}
