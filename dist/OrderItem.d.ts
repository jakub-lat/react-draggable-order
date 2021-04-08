import React, { CSSProperties, PropsWithChildren } from 'react';
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
export declare const OrderItemContext: React.Context<IOrderItemContext>;
declare function OrderItem({ children, index, onMove, style, inactiveStyle, grabbingStyle, grabbingClassName, wrapperClassName, className, hoverClassName, }: PropsWithChildren<IProps>): JSX.Element;
declare namespace OrderItem {
    var Handle: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => JSX.Element;
}
export default OrderItem;
