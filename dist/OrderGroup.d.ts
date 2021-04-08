import React, { HTMLAttributes } from 'react';
export interface OrderGroupConfig {
    mode: 'over' | 'between';
}
interface IContext {
    others: HTMLElement[];
    hoveredIndex?: number;
    setHoveredIndex: (i: number | undefined) => void;
    config: OrderGroupConfig;
}
export declare const OrderGroupContext: React.Context<IContext>;
export declare const elementDataKey = "orderableElement";
export declare type Props = HTMLAttributes<HTMLDivElement> & OrderGroupConfig;
export default function OrderGroup({ children, mode, ...props }: React.PropsWithChildren<Props>): JSX.Element;
export {};
