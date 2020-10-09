// fns

export function throttle(fn, min = 0, max = 0) {
  let id = null;
  let dead = false;
  let lastExec = 0;

  function handler(...args) {
    if (dead) {
      return;
    }

    const elapsed = Date.now() - lastExec;
    const minDiff = Math.max(0, min - elapsed);
    const maxDiff = Math.max(0, max - elapsed);

    clearTimeout(id);

    id = setTimeout(() => {
      fn(...args);
      lastExec = Date.now();
      id = null;
    }, id && max > 0 ? maxDiff > min ? min : maxDiff : minDiff);
  }

  handler.cancel = () => {
    clearTimeout(id);
    dead = true;
  };

  return handler;
}
