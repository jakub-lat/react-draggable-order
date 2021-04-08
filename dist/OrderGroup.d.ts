import React from 'react';
interface IContext {
    others: HTMLElement[];
}
export declare const OrderGroupContext: React.Context<IContext>;
export declare const elementDataKey = "orderableElement";
export default function OrderGroup({ children }: React.PropsWithChildren<any>): JSX.Element;
export {};
