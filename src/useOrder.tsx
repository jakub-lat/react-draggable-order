/* eslint-disable no-param-reassign */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { elementDataKey, OrderGroupConfig, OrderGroupContext } from './OrderGroup';
import { pauseEvent, useIsMounted } from './utils';

interface IResult<T> {
  isGrabbing: boolean;
  isHover: boolean;
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
}

interface Pos {
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
}

const calculateDistance = (config: OrderGroupConfig) => (el: HTMLElement, pos: Pos): number => {
  if (config.mode === 'between') {
    return Math.abs(el.getBoundingClientRect().top - pos.clientY);
  }

  const half = el.getBoundingClientRect().height;
  return Math.abs(el.getBoundingClientRect().top + half - pos.clientY);
};

export default function useOrder<T extends HTMLElement>({
  elementRef: ref,
  wrapperRef,
  index,
  onMove,
}: IProps<T>): IResult<T> {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [offset, setOffset] = useState([0, 0]);

  const closestIndex = React.useRef<number>();

  const isMounted = useIsMounted();
  const { others, hoveredIndex, setHoveredIndex, config } = useContext(OrderGroupContext);

  const calcDist = calculateDistance(config);

  const dragMove = useCallback(
    (e, pos: Pos) => {
      if (!isGrabbing) return;

      if (e) pauseEvent(e);

      ref.current.style.transform = `translate(${pos.pageX - offset[0]}px, ${
        pos.pageY - offset[1]
      }px)`;

      const elementIndex = others.reduce((prev, el, i) => {
        if (prev === -1) return i;
        return calcDist(el, pos) < calcDist(others[prev], pos) ? i : prev;
      }, -1);

      closestIndex.current = elementIndex;

      if (
        config.mode === 'between' &&
        (elementIndex > index ? elementIndex - 1 : elementIndex) !== index
      ) {
        setHoveredIndex(elementIndex);
      } else if (config.mode !== 'between' && elementIndex !== index) {
        setHoveredIndex(elementIndex);
      } else {
        setHoveredIndex(undefined);
      }
    },
    [isGrabbing, offset, ref, others, index, setHoveredIndex, config.mode, calcDist],
  );

  const dragStart = useCallback(
    (e, pos: Pos) => {
      setIsGrabbing(true);

      if (e) pauseEvent(e);

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

    if (i !== undefined) {
      if (config.mode === 'between' && i > index) i -= 1;

      if (i !== index) {
        onMove(i);
      }
    }

    // closestElement.current?.classList?.remove(hoverClassName);
    if (ref.current) ref.current.style.transform = '';

    closestIndex.current = undefined;
    setHoveredIndex(undefined);

    if (isMounted()) {
      setIsGrabbing(false);
    }
  }, [isGrabbing, index, isMounted, onMove, ref, setHoveredIndex, config.mode]);

  const mouseDown = (e: React.MouseEvent<HTMLElement>) => dragStart(e, e);
  const mouseMove = (e: React.MouseEvent<HTMLElement>) => dragMove(e, e);
  const touchStart = (e: React.TouchEvent<HTMLElement>) => dragStart(null, e.touches[0]);
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
    isHover: hoveredIndex === index,
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
