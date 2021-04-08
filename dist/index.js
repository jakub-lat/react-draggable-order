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

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

var OrderGroupContext = React__default['default'].createContext({
    others: [],
});
var elementDataKey = 'orderableElement';
function OrderGroup(_a) {
    var _b;
    var children = _a.children, props = __rest(_a, ["children"]);
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
        React__default['default'].createElement("div", __assign({ ref: ref }, props), children)));
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
function arrayMove(base, from, to) {
    var arr = __spreadArray([], base);
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    return arr;
}

/* eslint-disable no-param-reassign */
function useOrder(_a) {
    var _b;
    var ref = _a.elementRef, wrapperRef = _a.wrapperRef, index = _a.index, onMove = _a.onMove, _c = _a.hoverClassName, hoverClassName = _c === void 0 ? 'hover' : _c;
    var _d = React.useState(false), isGrabbing = _d[0], setIsGrabbing = _d[1];
    var _e = React.useState([0, 0]), offset = _e[0], setOffset = _e[1];
    var closestIndex = React__default['default'].useRef();
    var closestElement = React__default['default'].useRef();
    var isMounted = useIsMounted();
    var others = React.useContext(OrderGroupContext).others;
    var dragMove = React.useCallback(function (e, pos) {
        var _a, _b, _c, _d;
        if (!isGrabbing)
            return;
        if (e)
            pauseEvent(e);
        ref.current.style.transform = "translate(" + (pos.pageX - offset[0]) + "px, " + (pos.pageY - offset[1]) + "px)";
        var elementIndex = others.reduce(function (prev, el, i) {
            // eslint-disable-next-line no-nested-ternary
            return prev === -1
                ? i
                : Math.abs(el.getBoundingClientRect().top - pos.clientY) <
                    Math.abs(others[prev].getBoundingClientRect().top - pos.clientY)
                    ? i
                    : prev;
        }, -1);
        (_b = (_a = closestElement.current) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.remove(hoverClassName);
        closestIndex.current = elementIndex;
        closestElement.current = others[elementIndex];
        if ((elementIndex > index ? elementIndex - 1 : elementIndex) !== index) {
            (_d = (_c = closestElement.current) === null || _c === void 0 ? void 0 : _c.classList) === null || _d === void 0 ? void 0 : _d.add(hoverClassName);
        }
    }, [isGrabbing, offset, ref, others, index, hoverClassName]);
    var dragStart = React.useCallback(function (e, pos) {
        setIsGrabbing(true);
        if (e)
            pauseEvent(e);
        var offs = [
            pos.pageX - ref.current.getBoundingClientRect().left,
            pos.pageY - ref.current.getBoundingClientRect().top,
        ];
        setOffset(offs);
        ref.current.style.transform = "translate(" + (pos.pageX - offs[0]) + "px, " + (pos.pageY - offs[1]) + "px)";
    }, [ref]);
    var dragEnd = React.useCallback(function () {
        var _a, _b;
        if (!isGrabbing)
            return;
        var i = closestIndex.current;
        if (i !== undefined) {
            if (i > index)
                i -= 1;
            if (i !== index) {
                onMove(i);
            }
        }
        (_b = (_a = closestElement.current) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.remove(hoverClassName);
        if (ref.current)
            ref.current.style.transform = '';
        closestElement.current = undefined;
        closestIndex.current = undefined;
        if (isMounted()) {
            setIsGrabbing(false);
        }
    }, [isGrabbing, index, isMounted, onMove, ref, hoverClassName]);
    var mouseDown = function (e) { return dragStart(e, e); };
    var mouseMove = function (e) { return dragMove(e, e); };
    var touchStart = function (e) { return dragStart(null, e.touches[0]); };
    var touchMove = function (e) { return dragMove(null, e.touches[0]); };
    React.useEffect(function () {
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchend', dragEnd);
        wrapperRef.current.style.height = ref.current.offsetHeight + "px";
        wrapperRef.current.dataset[elementDataKey] = 'true';
        var wrapper = wrapperRef.current;
        return function () {
            window.removeEventListener('mouseup', dragEnd);
            window.removeEventListener('touchend', dragEnd);
            delete wrapper.dataset[elementDataKey];
        };
    });
    return {
        isGrabbing: isGrabbing,
        mouseDown: mouseDown,
        mouseMove: mouseMove,
        touchStart: touchStart,
        touchMove: touchMove,
        elementStyle: {
            zIndex: isGrabbing ? 100000 : 0,
            position: isGrabbing ? 'fixed' : undefined,
            top: isGrabbing ? 0 : undefined,
            left: isGrabbing ? 0 : undefined,
            width: (_b = wrapperRef.current) === null || _b === void 0 ? void 0 : _b.clientWidth,
            backfaceVisibility: 'hidden',
            touchAction: 'none',
        },
    };
}

var OrderItemContext = React.createContext({
    mouseDown: function () { return null; },
    touchStart: function () { return null; },
});
function OrderItem(_a) {
    var children = _a.children, index = _a.index, onMove = _a.onMove, style = _a.style, inactiveStyle = _a.inactiveStyle, grabbingStyle = _a.grabbingStyle, _b = _a.grabbingClassName, grabbingClassName = _b === void 0 ? '' : _b, _c = _a.wrapperClassName, wrapperClassName = _c === void 0 ? '' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, hoverClassName = _a.hoverClassName;
    var elementRef = React.useRef();
    var wrapperRef = React.useRef();
    var _e = useOrder({
        elementRef: elementRef,
        wrapperRef: wrapperRef,
        index: index,
        onMove: onMove,
        hoverClassName: hoverClassName,
    }), mouseDown = _e.mouseDown, mouseMove = _e.mouseMove, touchStart = _e.touchStart, touchMove = _e.touchMove, isGrabbing = _e.isGrabbing, elementStyle = _e.elementStyle;
    var context = React.useState({
        mouseDown: mouseDown,
        touchStart: touchStart,
    })[0];
    return (React__default['default'].createElement("div", { ref: wrapperRef, className: wrapperClassName },
        React__default['default'].createElement("div", { ref: elementRef, className: className + (isGrabbing ? " " + grabbingClassName : ''), style: __assign(__assign(__assign({}, elementStyle), style), (isGrabbing ? grabbingStyle : inactiveStyle)), onMouseMove: mouseMove, onTouchMove: touchMove },
            React__default['default'].createElement(OrderItemContext.Provider, { value: context }, children))));
}
OrderItem.Handle = function OrderItemHandle(_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var _b = React.useContext(OrderItemContext), mouseDown = _b.mouseDown, touchStart = _b.touchStart;
    return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    React__default['default'].createElement("div", __assign({ onMouseDown: mouseDown, onTouchStart: touchStart }, props), children));
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".defaultTheme_rdo-group__3APW4 {\r\n}\r\n.defaultTheme_rdo-group__3APW4 * {\r\n    box-sizing: border-box;\r\n}\r\n\r\n.defaultTheme_rdo-wrapper__1-_Pp {\r\n    height: 50px;\r\n    margin: 20px 0;\r\n    position: relative;\r\n}\r\n.defaultTheme_rdo-hover__3u2cH::before {\r\n    content: '';\r\n    width: 100%;\r\n    display: block;\r\n    position: absolute;\r\n    top: -10px;\r\n    border-top: 2px solid black;\r\n}\r\n\r\n.defaultTheme_rdo-item__3Fl0R {\r\n    height: inherit;\r\n    width: 100%;\r\n    display: flex;\r\n    background: #eee;\r\n}\r\n.defaultTheme_rdo-item-grabbing__3CzBx {\r\n    box-shadow: 0 0 15px 0 rgba(0,0,0,0.2);\r\n}\r\n\r\n.defaultTheme_rdo-item-handle__1S-1K {\r\n    height: 50px;\r\n    width: 100px;\r\n    padding: 10px;\r\n    background-color: #ccc;\r\n    float: left;\r\n    cursor: grab;\r\n}\r\n\r\n.defaultTheme_rdo-item-content__7_JEn {\r\n    padding: 10px;\r\n    flex: 1 0;\r\n}";
styleInject(css_248z);

var item = {
    wrapperClassName: 'rdo-wrapper',
    className: 'rdo-item',
    hoverClassName: 'rdo-hover',
    grabbingClassName: 'rdo-item-grabbing',
};
var group = {
    className: 'rdo-group',
};
var handle = {
    className: 'rdo-item-handle',
};
var content = {
    className: 'rdo-item-content',
};

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    item: item,
    group: group,
    handle: handle,
    content: content
});

exports.OrderGroup = OrderGroup;
exports.OrderItem = OrderItem;
exports.arrayMove = arrayMove;
exports.defaultTheme = index;
exports.useOrder = useOrder;
//# sourceMappingURL=index.js.map
