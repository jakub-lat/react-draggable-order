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
  mouseDown: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

export const OrderItemContext = createContext<IOrderItemContext>({
  mouseDown: () => null,
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

  const { mouseDown, mouseMove, isGrabbing, elementStyle } = useOrder({
    elementRef,
    wrapperRef,
    index,
    onMove,
    hoverClassName,
  });

  const [context] = useState<IOrderItemContext>({
    mouseDown,
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
  const { mouseDown } = useContext(OrderItemContext);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onMouseDown={mouseDown} {...props}>
      {children}
    </div>
  );
};
