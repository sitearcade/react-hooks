// import

import {useRef, useEffect, useState} from 'react';

// export

export function useLatestRef(val, deps) {
  const ref = useRef(val);

  useEffect(() => (ref.current = val), deps);

  return ref;
}

export function useLatestState(stateFn, deps) {
  const [state, setState] = useState(stateFn);

  useEffect(() => setState(stateFn()), deps);

  return state;
}
