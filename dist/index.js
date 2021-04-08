'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var OrderGroupContext = React__default['default'].createContext({
    others: [],
});
var elementDataKey = 'orderableElement';
function OrderGroup(_a) {
    var _b;
    var children = _a.children;
    var ref = React.useRef();
    var _c = React.useState({
        others: ((_b = ref === null || ref === void 0 ? void 0 : ref.current) === null || _b === void 0 ? void 0 : _b.childNodes)
            ? Array.from(ref.current.childNodes).map(function (x) { return x; })
            : [],
    }), value = _c[0], setValue = _c[1];
    React.useEffect(function () {
        setValue(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), { others: Array.from(((_a = ref === null || ref === void 0 ? void 0 : ref.current) === null || _a === void 0 ? void 0 : _a.childNodes) || [])
                    .map(function (x) { return x; })
                    .filter(function (x) { return !!x.dataset[elementDataKey]; }) }));
        });
    }, [children]);
    return (React__default['default'].createElement(OrderGroupContext.Provider, { value: value },
        React__default['default'].createElement("div", { ref: ref }, children)));
}

var useIsMounted = function () {
    var ref = React.useRef(false);
    var _a = React.useState(false), setIsMounted = _a[1];
    React.useEffect(function () {
        ref.current = true;
        setIsMounted(true);
        return function () {
            ref.current = false;
        };
    }, []);
    return function () { return ref.current; };
};
function pauseEvent(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    if (e.preventDefault)
        e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
}

/* eslint-disable no-param-reassign */
function useOrder(_a) {
    var _b;
    var ref = _a.elementRef, wrapperRef = _a.wrapperRef, index = _a.index, onMove = _a.onMove;
    var _c = React.useState(false), isGrabbing = _c[0], setIsGrabbing = _c[1];
    var _d = React.useState([0, 0]), offset = _d[0], setOffset = _d[1];
    var closestIndex = React__default['default'].useRef(null);
    var closestElement = React__default['default'].useRef();
    var isMounted = useIsMounted();
    var others = React.useContext(OrderGroupContext).others;
    var mouseDown = React.useCallback(function (e) {
        setIsGrabbing(true);
        var offs = [
            e.pageX - ref.current.getBoundingClientRect().left,
            e.pageY - ref.current.getBoundingClientRect().top,
        ];
        setOffset(offs);
        ref.current.style.transform = "translate(" + (e.pageX - offs[0]) + "px, " + (e.pageY - offs[1]) + "px)";
    }, [ref]);
    var mouseUp = React.useCallback(function () {
        var _a, _b;
        if (!isGrabbing)
            return;
        var i = closestIndex.current;
        if (i !== null) {
            if (i > index)
                i -= 1;
            if (i !== index) {
                onMove(i);
            }
        }
        (_b = (_a = closestElement.current) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.remove('active');
        if (ref.current)
            ref.current.style.transform = '';
        if (isMounted()) {
            setIsGrabbing(false);
        }
    }, [isGrabbing, index, isMounted, onMove, ref]);
    var mouseMove = React.useCallback(function (e) {
        var _a, _b, _c, _d;
        if (!isGrabbing)
            return;
        pauseEvent(e);
        ref.current.style.transform = "translate(" + (e.pageX - offset[0]) + "px, " + (e.pageY - offset[1]) + "px)";
        var elementIndex = others.reduce(function (prev, x, i) {
            // eslint-disable-next-line no-nested-ternary
            return prev === -1
                ? i
                : Math.abs(x.getBoundingClientRect().top - e.clientY) <
                    Math.abs(others[prev].getBoundingClientRect().top - e.clientY)
                    ? i
                    : prev;
        }, -1);
        (_b = (_a = closestElement.current) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.remove('active');
        closestIndex.current = elementIndex;
        closestElement.current = others[elementIndex];
        if ((elementIndex > index ? elementIndex - 1 : elementIndex) !== index) {
            (_d = (_c = closestElement.current) === null || _c === void 0 ? void 0 : _c.classList) === null || _d === void 0 ? void 0 : _d.add('active');
        }
    }, [isGrabbing, offset, ref, others, index]);
    React.useEffect(function () {
        window.addEventListener('mouseup', mouseUp);
        wrapperRef.current.style.height = ref.current.offsetHeight + "px";
        wrapperRef.current.dataset[elementDataKey] = 'true';
        var wrapper = wrapperRef.current;
        return function () {
            window.removeEventListener('mouseup', mouseUp);
            delete wrapper.dataset[elementDataKey];
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

exports.OrderGroup = OrderGroup;
exports.useOrder = useOrder;
//# sourceMappingURL=index.js.map
