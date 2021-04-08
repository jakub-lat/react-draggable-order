/* eslint-disable no-param-reassign */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { elementDataKey, OrderGroupContext } from './OrderGroup';
import { pauseEvent, useIsMounted } from './utils';

interface IResult<T> {
  isGrabbing: boolean;
  elementStyle: React.HTMLAttributes<T>['style'];
  mouseDown: (e: React.MouseEvent<HTMLElement>) => void;
  mouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  touchStart: (e: React.TouchEvent<HTMLElement>) => void;
  touchMove: (e: React.TouchEvent<HTMLElement>) => void;
}

interface IProps<T> {
  onMove: (i: number) => void;
  index: number;
  elementRef: React.MutableRefObject<T>;
  wrapperRef: React.MutableRefObject<HTMLElement>;
  hoverClassName?: string;
}

interface Pos {
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
}

export default function useOrder<T extends HTMLElement>({
  elementRef: ref,
  wrapperRef,
  index,
  onMove,
  hoverClassName = 'hover',
}: IProps<T>): IResult<T> {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [offset, setOffset] = useState([0, 0]);

  const closestIndex = React.useRef<null | number>(null);
  const closestElement = React.useRef<HTMLHRElement>();

  const isMounted = useIsMounted();
  const { others } = useContext(OrderGroupContext);

  const dragStart = useCallback(
    (e, pos: Pos) => {
      setIsGrabbing(true);

      const offs = [
        pos.pageX - ref.current.getBoundingClientRect().left,
        pos.pageY - ref.current.getBoundingClientRect().top,
      ];
      setOffset(offs);
      ref.current.style.transform = `translate(${pos.pageX - offs[0]}px, ${pos.pageY - offs[1]}px)`;
    },
    [ref],
  );

  const dragEnd = useCallback(() => {
    if (!isGrabbing) return;

    let i = closestIndex.current;

    if (i !== null) {
      if (i > index) i -= 1;

      if (i !== index) {
        onMove(i);
      }
    }

    closestElement.current?.classList?.remove(hoverClassName);
    if (ref.current) ref.current.style.transform = '';

    if (isMounted()) {
      setIsGrabbing(false);
    }
  }, [isGrabbing, index, isMounted, onMove, ref, hoverClassName]);

  const dragMove = useCallback(
    (e, pos: Pos) => {
      if (!isGrabbing) return;

      if (e) pauseEvent(e);

      ref.current.style.transform = `translate(${pos.pageX - offset[0]}px, ${
        pos.pageY - offset[1]
      }px)`;

      const elementIndex = others.reduce((prev, el, i) => {
        // eslint-disable-next-line no-nested-ternary
        return prev === -1
          ? i
          : Math.abs(el.getBoundingClientRect().top - pos.clientY) <
            Math.abs(others[prev].getBoundingClientRect().top - pos.clientY)
          ? i
          : prev;
      }, -1);

      closestElement.current?.classList?.remove(hoverClassName);

      closestIndex.current = elementIndex;
      closestElement.current = others[elementIndex] as HTMLHRElement;

      if ((elementIndex > index ? elementIndex - 1 : elementIndex) !== index) {
        closestElement.current?.classList?.add(hoverClassName);
      }
    },
    [isGrabbing, offset, ref, others, index, hoverClassName],
  );

  const mouseDown = (e: React.MouseEvent<HTMLElement>) => dragStart(e, e);
  const mouseMove = (e: React.MouseEvent<HTMLElement>) => dragMove(e, e);
  const touchStart = (e: React.TouchEvent<HTMLElement>) => dragStart(e, e.touches[0]);
  const touchMove = (e: React.TouchEvent<HTMLElement>) => dragMove(null, e.touches[0]);

  useEffect(() => {
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);

    wrapperRef.current.style.height = `${ref.current.offsetHeight}px`;
    wrapperRef.current.dataset[elementDataKey] = 'true';

    const wrapper = wrapperRef.current;

    return () => {
      window.removeEventListener('mouseup', dragEnd);
      window.removeEventListener('touchend', dragEnd);
      delete wrapper.dataset[elementDataKey];
    };
  });

  return {
    isGrabbing,
    mouseDown,
    mouseMove,
    touchStart,
    touchMove,
    elementStyle: {
      zIndex: isGrabbing ? 100000 : 0,
      position: isGrabbing ? 'fixed' : undefined,
      top: isGrabbing ? 0 : undefined,
      left: isGrabbing ? 0 : undefined,
      width: wrapperRef.current?.clientWidth,
      backfaceVisibility: 'hidden',
      touchAction: 'none',
    },
  };
}
