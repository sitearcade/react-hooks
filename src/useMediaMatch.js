// import

import {isServer} from '@sitearcade/is-env';
import {useState, useEffect} from 'react';

// export

export function useMediaMatch(query) {
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    if (isServer) {
      return;
    }

    const matcher = window.matchMedia(query);
    const isModern = 'addEventListener' in matcher;
    const onUpdateMatch = ({matches}) => setIsMatch(matches);

    if (isModern) {
      matcher.addEventListener('change', onUpdateMatch);
    } else {
      matcher.addListener(onUpdateMatch);
    }

    onUpdateMatch(matcher);

    return () => {
      if (isModern) {
        matcher.removeEventListener('change', onUpdateMatch);
      } else {
        matcher.removeListener(onUpdateMatch);
      }
    };
  }, [query, setIsMatch]);

  return isMatch;
}
