import React, {
  createContext,
  CSSProperties,
  HTMLAttributes,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import useOrder from './useOrder';

export interface IProps {
  index: number;
  onMove: (i: number) => void;

  wrapperClassName?: string;
  wrapperHoverClassName?: string;
  wrapperStyle?: CSSProperties;
  wrapperHoverStyle?: CSSProperties;

  className?: string;
  style?: CSSProperties;

  hoverStyle?: CSSProperties;
  hoverClassName?: string;

  inactiveClassName?: string;
  grabbingClassName?: string;
  inactiveStyle?: CSSProperties;
  grabbingStyle?: CSSProperties;
}

export interface IOrderItemContext {
  mouseDown: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  touchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
}

export const OrderItemContext = createContext<IOrderItemContext>({
  mouseDown: () => null,
  touchStart: () => null,
});

export default function OrderItem({
  children,
  index,
  onMove,
  style,
  wrapperClassName = '',
  wrapperHoverClassName = '',
  wrapperStyle = {},
  wrapperHoverStyle = {},

  className = '',
  inactiveStyle = {},
  grabbingStyle = {},
  inactiveClassName = '',
  grabbingClassName = '',
  hoverClassName = '',
  hoverStyle = {},
}: PropsWithChildren<IProps>) {
  const elementRef = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;
  const wrapperRef = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;

  const {
    mouseDown,
    mouseMove,
    touchStart,
    touchMove,
    isGrabbing,
    isHover,
    elementStyle,
  } = useOrder({
    elementRef,
    wrapperRef,
    index,
    onMove,
  });

  const [context] = useState<IOrderItemContext>({
    mouseDown,
    touchStart,
  });

  return (
    <div
      ref={wrapperRef}
      className={classNames(wrapperClassName, isHover && wrapperHoverClassName)}
      style={{ ...wrapperStyle, ...(isHover ? wrapperHoverStyle : {}) }}
    >
      <div
        ref={elementRef}
        className={classNames(
          className,
          isGrabbing && grabbingClassName,
          !isGrabbing && inactiveClassName,
          isHover && hoverClassName,
        )}
        style={{
          ...elementStyle,
          ...style,
          ...(isGrabbing ? grabbingStyle : inactiveStyle),
          ...(isHover ? hoverStyle : {}),
        }}
        onMouseMove={mouseMove}
        onTouchMove={touchMove}
      >
        <OrderItemContext.Provider value={context}>{children}</OrderItemContext.Provider>
      </div>
    </div>
  );
}

OrderItem.Handle = function OrderItemHandle({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  const { mouseDown, touchStart } = useContext(OrderItemContext);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onMouseDown={mouseDown} onTouchStart={touchStart} {...props}>
      {children}
    </div>
  );
};
