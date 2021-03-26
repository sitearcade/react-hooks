// import

import {isClient} from '@sitearcade/is-env';

import {useWindowEvents} from './useWindowEvents';

// vars

const events = ['scroll', 'resize'];

// fns

function getScroll() {
  return {
    x: isClient ? window.pageXOffset : 0,
    y: isClient ? window.pageYOffset : 0,
  };
}

// export

export function useWindowScroll(ms?: number) {
  return useWindowEvents(getScroll, events, ms);
}
