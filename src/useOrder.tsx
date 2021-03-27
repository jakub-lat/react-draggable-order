import React, { useCallback, useEffect, useState, useContext, useRef } from 'react';
import { OrderGroupContext, elementDataKey } from './OrderGroup';

interface IResult<T> {
  isGrabbing: boolean;
  mouseDown: (e: React.MouseEvent) => void;
  mouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  elementStyle: React.HTMLAttributes<T>['style'];
}

interface IProps<T> {
  onMove: (i: number) => void;
  index: number;
  elementRef: React.MutableRefObject<T>;
  wrapperRef: React.MutableRefObject<HTMLElement>;
}

export default function useOrder<T extends HTMLElement>({
  elementRef: ref,
  wrapperRef,
  index,
  onMove,
}: IProps<T>): IResult<T> {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [offset, setOffset] = useState([0, 0]);

  const closestIndex = React.useRef<null | number>(null);
  const closestElement = React.useRef<HTMLHRElement>();

  const isMounted = useIsMounted();
  const { others } = useContext(OrderGroupContext);

  const mouseDown = useCallback((e: React.MouseEvent) => {
    setIsGrabbing(true);

    const offs = [
      e.pageX - ref.current.getBoundingClientRect().left,
      e.pageY - ref.current.getBoundingClientRect().top,
    ];
    setOffset(offs);
    ref.current.style.transform = `translate(${e.pageX - offs[0]}px, ${e.pageY - offs[1]}px)`;
  }, []);

  const mouseUp = useCallback(() => {
    if (!isGrabbing) return;

    const i = closestIndex.current;
    if (i !== null && i !== index) {
      onMove(i > index ? i - 1 : i);
    }

    closestElement.current?.classList?.remove('active');
    if (ref.current) ref.current.style.transform = '';

    if (isMounted) {
      setIsGrabbing(false);
    }
  }, [isGrabbing, isMounted()]);

  const mouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isGrabbing) return;

      pauseEvent(e);

      ref.current.style.transform = `translate(${e.pageX - offset[0]}px, ${e.pageY - offset[1]}px)`;

      const i = others.reduce((prev, curr, i) => {
        return prev === -1
          ? i
          : Math.abs(curr.getBoundingClientRect().top - e.clientY) <
            Math.abs(others[prev].getBoundingClientRect().top - e.clientY)
          ? i
          : prev;
      }, -1);

      closestElement.current?.classList?.remove('active');

      closestIndex.current = i;
      closestElement.current = others[i] as HTMLHRElement;

      if (closestIndex.current !== index) {
        closestElement.current?.classList?.add('active');
      }
    },
    [isGrabbing],
  );

  useEffect(() => {
    window.addEventListener('mouseup', mouseUp);

    wrapperRef.current.style.height = ref.current.offsetHeight + 'px';
    wrapperRef.current.dataset[elementDataKey] = 'true';

    return () => {
      window.removeEventListener('mouseup', mouseUp);
      delete wrapperRef.current.dataset[elementDataKey];
    };
  });

  return {
    isGrabbing,
    mouseDown,
    mouseMove,
    elementStyle: {
      zIndex: isGrabbing ? 100000 : 0,
      position: isGrabbing ? 'fixed' : undefined,
      top: isGrabbing ? 0 : undefined,
      left: isGrabbing ? 0 : undefined,
      width: wrapperRef.current?.clientWidth,
      backfaceVisibility: 'hidden',
    },
  };
}

function pauseEvent(e) {
  if (e.stopPropagation) e.stopPropagation();
  if (e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}

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
