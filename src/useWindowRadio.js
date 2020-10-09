// import

import {useRef, useEffect, useCallback, useMemo} from 'react';

// vars

const viewUrl = process.env.ARC_VIEW_URL;
const editUrl = process.env.ARC_EDIT_URL;

// fns

const noop = () => null;
const isFunction = (fn) => typeof fn === 'function';
const isString = (fn) => typeof fn === 'string';

const getContentWindow = (ref) => ref.current?.contentWindow;

const getHandler = (onMessage, filterOrigin) => (
  isFunction(onMessage) ?
    (event) => {
      if (
        isFunction(filterOrigin) ?
          filterOrigin(event.origin) :
          isString(filterOrigin) ?
            event.origin.includes(filterOrigin) :
            true
      ) {
        onMessage(event.data, event);
      }
    } : noop
);

// export

export function useWindowRadio(target, onMessage) {
  useEffect(() => {
    if (!target) {
      return;
    }

    const handler = getHandler(onMessage, editUrl);

    window.addEventListener('message', handler, false);

    return () => window.removeEventListener('message', handler);
  }, [target, onMessage]);

  return useCallback((msg) => target?.postMessage(msg, editUrl), [target]);
}

// TODO: Seems like I should be able to merge with useWindowRadio!

export function useFrameRadio(onMessage) {
  const frameRef = useRef(null);
  const contentWindow = getContentWindow(frameRef);

  useEffect(() => {
    if (!contentWindow) {
      return;
    }

    const handler = getHandler(onMessage, viewUrl);

    window.addEventListener('message', handler, false);

    return () => window.removeEventListener('message', handler);
  }, [contentWindow, onMessage]);

  return useMemo(() => {
    return [
      frameRef,
      (msg) => contentWindow?.postMessage(msg, viewUrl),
    ];
  }, []);
}
