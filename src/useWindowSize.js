// import

import {isClient} from '@sitearcade/is-env';

import useWindowEvents from './useWindowEvents';

// vars

const events = ['resize'];

// fns

function getSize() {
  return {
    width: isClient ? window.outerWidth : 0,
    height: isClient ? window.outerHeight : 0,
  };
}

// export

export default function useWindowSize(ms) {
  return useWindowEvents(getSize, events, ms);
}
