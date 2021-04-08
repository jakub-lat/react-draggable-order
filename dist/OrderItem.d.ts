import React, { CSSProperties, PropsWithChildren } from 'react';
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
export declare const OrderItemContext: React.Context<IOrderItemContext>;
declare function OrderItem({ children, index, onMove, style, wrapperClassName, wrapperHoverClassName, wrapperStyle, wrapperHoverStyle, className, inactiveStyle, grabbingStyle, inactiveClassName, grabbingClassName, hoverClassName, hoverStyle, }: PropsWithChildren<IProps>): JSX.Element;
declare namespace OrderItem {
    var Handle: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => JSX.Element;
}
export default OrderItem;
