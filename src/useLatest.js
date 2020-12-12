// import

import {useRef, useEffect} from 'react';

// export

export function useLatestRef(val) {
  const ref = useRef(val);

  useEffect(() => (ref.current = val));

  return ref;
}
