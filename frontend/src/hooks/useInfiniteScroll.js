import { useEffect, useRef, useCallback } from 'react';

/**
 * Triggers `onIntersect` when the sentinel element enters the viewport.
 * Returns a `ref` to attach to the sentinel div.
 *
 * @param {Function} onIntersect - called when sentinel enters viewport
 * @param {boolean}  enabled     - enable/disable the observer
 */
const useInfiniteScroll = (onIntersect, enabled = true) => {
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  const stableCallback = useCallback(onIntersect, [onIntersect]);

  useEffect(() => {
    if (!enabled) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          stableCallback();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const el = sentinelRef.current;
    if (el) observerRef.current.observe(el);

    return () => {
      if (el) observerRef.current?.unobserve(el);
      observerRef.current?.disconnect();
    };
  }, [stableCallback, enabled]);

  return sentinelRef;
};

export default useInfiniteScroll;
