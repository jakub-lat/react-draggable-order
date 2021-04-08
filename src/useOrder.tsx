/* eslint-disable no-param-reassign */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { elementDataKey, OrderGroupContext } from './OrderGroup';
import { pauseEvent, useIsMounted } from './utils';

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
  hoverClassName?: string;
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

  const mouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsGrabbing(true);

      const offs = [
        e.pageX - ref.current.getBoundingClientRect().left,
        e.pageY - ref.current.getBoundingClientRect().top,
      ];
      setOffset(offs);
      ref.current.style.transform = `translate(${e.pageX - offs[0]}px, ${e.pageY - offs[1]}px)`;
    },
    [ref],
  );

  const mouseUp = useCallback(() => {
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

  const mouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isGrabbing) return;

      pauseEvent(e);

      ref.current.style.transform = `translate(${e.pageX - offset[0]}px, ${e.pageY - offset[1]}px)`;

      const elementIndex = others.reduce((prev, x, i) => {
        // eslint-disable-next-line no-nested-ternary
        return prev === -1
          ? i
          : Math.abs(x.getBoundingClientRect().top - e.clientY) <
            Math.abs(others[prev].getBoundingClientRect().top - e.clientY)
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

  useEffect(() => {
    window.addEventListener('mouseup', mouseUp);

    wrapperRef.current.style.height = `${ref.current.offsetHeight}px`;
    wrapperRef.current.dataset[elementDataKey] = 'true';

    const wrapper = wrapperRef.current;

    return () => {
      window.removeEventListener('mouseup', mouseUp);
      delete wrapper.dataset[elementDataKey];
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
