// import

import {isClient} from '@sitearcade/is-env';

import {useWindowEvents} from './useWindowEvents';

// vars

const events = ['resize'];

// fns

function getSize() {
  return {
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
  };
}

// export

export function useWindowSize(ms?: number) {
  return useWindowEvents(getSize, events, ms);
}
