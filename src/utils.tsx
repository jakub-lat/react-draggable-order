import { useEffect, useRef, useState } from 'react';

export const useIsMounted = () => {
  const ref = useRef(false);
  const [, setIsMounted] = useState(false);
  useEffect(() => {
    ref.current = true;
    setIsMounted(true);
    return () => {
      ref.current = false;
    };
  }, []);
  return () => ref.current;
};

export function pauseEvent(e) {
  if (e.stopPropagation) e.stopPropagation();
  if (e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}
