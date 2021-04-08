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
import useOrder from './useOrder';

export interface IProps {
  index: number;
  onMove: (i: number) => void;
  style?: CSSProperties;
  inactiveStyle?: CSSProperties;
  grabbingStyle?: CSSProperties;
  wrapperClassName?: string;
  className?: string;
  inactiveClassName?: string;
  grabbingClassName?: string;
  hoverClassName?: string;
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
  inactiveStyle,
  grabbingStyle,
  grabbingClassName = '',
  wrapperClassName = '',
  className = '',
  hoverClassName,
}: PropsWithChildren<IProps>) {
  const elementRef = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;
  const wrapperRef = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;

  const { mouseDown, mouseMove, touchStart, touchMove, isGrabbing, elementStyle } = useOrder({
    elementRef,
    wrapperRef,
    index,
    onMove,
    hoverClassName,
  });

  const [context] = useState<IOrderItemContext>({
    mouseDown,
    touchStart,
  });

  return (
    <div ref={wrapperRef} className={wrapperClassName}>
      <div
        ref={elementRef}
        className={className + (isGrabbing ? ` ${grabbingClassName}` : '')}
        style={{
          ...elementStyle,
          ...style,
          ...(isGrabbing ? grabbingStyle : inactiveStyle),
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
