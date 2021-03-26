// import

import {useRef, useEffect, useState} from 'react';

// export

export function useHover(enabled = true) {
  const hoverRef = useRef<HTMLElement>();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const {current} = hoverRef;
    const onMouseOver = () => setIsHovered(true);
    const onMouseOut = () => setIsHovered(false);

    if (enabled && current) {
      current.addEventListener('mouseover', onMouseOver);
      current.addEventListener('mouseout', onMouseOut);
    }

    return () => {
      if (enabled && current) {
        current.removeEventListener('mouseover', onMouseOver);
        current.removeEventListener('mouseout', onMouseOut);
      }
    };
  }, [enabled, hoverRef.current]);

  return [hoverRef, isHovered];
}
