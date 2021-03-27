var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { useCallback, useEffect, useState, useContext, useRef } from 'react';
import { OrderGroupContext, elementDataKey } from './OrderGroup';
export default function useOrder(_a) {
    var _b;
    var ref = _a.elementRef, wrapperRef = _a.wrapperRef, index = _a.index, onMove = _a.onMove;
    var _c = __read(useState(false), 2), isGrabbing = _c[0], setIsGrabbing = _c[1];
    var _d = __read(useState([0, 0]), 2), offset = _d[0], setOffset = _d[1];
    var closestIndex = React.useRef(null);
    var closestElement = React.useRef();
    var isMounted = useIsMounted();
    var others = useContext(OrderGroupContext).others;
    var mouseDown = useCallback(function (e) {
        setIsGrabbing(true);
        var offs = [
            e.pageX - ref.current.getBoundingClientRect().left,
            e.pageY - ref.current.getBoundingClientRect().top,
        ];
        setOffset(offs);
        ref.current.style.transform = "translate(" + (e.pageX - offs[0]) + "px, " + (e.pageY - offs[1]) + "px)";
    }, []);
    var mouseUp = useCallback(function () {
        var _a, _b;
        if (!isGrabbing)
            return;
        var i = closestIndex.current;
        if (i !== null && i !== index) {
            onMove(i > index ? i - 1 : i);
        }
        (_b = (_a = closestElement.current) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.remove('active');
        if (ref.current)
            ref.current.style.transform = '';
        if (isMounted) {
            setIsGrabbing(false);
        }
    }, [isGrabbing, isMounted()]);
    var mouseMove = useCallback(function (e) {
        var _a, _b, _c, _d;
        if (!isGrabbing)
            return;
        pauseEvent(e);
        ref.current.style.transform = "translate(" + (e.pageX - offset[0]) + "px, " + (e.pageY - offset[1]) + "px)";
        var i = others.reduce(function (prev, curr, i) {
            return prev === -1
                ? i
                : Math.abs(curr.getBoundingClientRect().top - e.clientY) <
                    Math.abs(others[prev].getBoundingClientRect().top - e.clientY)
                    ? i
                    : prev;
        }, -1);
        (_b = (_a = closestElement.current) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.remove('active');
        closestIndex.current = i;
        closestElement.current = others[i];
        if (closestIndex.current !== index) {
            (_d = (_c = closestElement.current) === null || _c === void 0 ? void 0 : _c.classList) === null || _d === void 0 ? void 0 : _d.add('active');
        }
    }, [isGrabbing]);
    useEffect(function () {
        window.addEventListener('mouseup', mouseUp);
        wrapperRef.current.style.height = ref.current.offsetHeight + 'px';
        wrapperRef.current.dataset[elementDataKey] = 'true';
        return function () {
            window.removeEventListener('mouseup', mouseUp);
            delete wrapperRef.current.dataset[elementDataKey];
        };
    });
    return {
        isGrabbing: isGrabbing,
        mouseDown: mouseDown,
        mouseMove: mouseMove,
        elementStyle: {
            zIndex: isGrabbing ? 100000 : 0,
            position: isGrabbing ? 'fixed' : undefined,
            top: isGrabbing ? 0 : undefined,
            left: isGrabbing ? 0 : undefined,
            width: (_b = wrapperRef.current) === null || _b === void 0 ? void 0 : _b.clientWidth,
            backfaceVisibility: 'hidden',
        },
    };
}
function pauseEvent(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    if (e.preventDefault)
        e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
}
export var useIsMounted = function () {
    var ref = useRef(false);
    var _a = __read(useState(false), 2), setIsMounted = _a[1];
    useEffect(function () {
        ref.current = true;
        setIsMounted(true);
        return function () {
            ref.current = false;
        };
    }, []);
    return function () { return ref.current; };
};
