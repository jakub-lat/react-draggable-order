import React from 'react';
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
}
export default function useOrder<T extends HTMLElement>({ elementRef: ref, wrapperRef, index, onMove, }: IProps<T>): IResult<T>;
export declare const useIsMounted: () => () => any;
export {};
