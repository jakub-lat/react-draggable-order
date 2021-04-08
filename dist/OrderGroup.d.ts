import React, { HTMLAttributes } from 'react';
interface IContext {
    others: HTMLElement[];
}
export declare const OrderGroupContext: React.Context<IContext>;
export declare const elementDataKey = "orderableElement";
export default function OrderGroup({ children, ...props }: React.PropsWithChildren<HTMLAttributes<HTMLDivElement>>): JSX.Element;
export {};
