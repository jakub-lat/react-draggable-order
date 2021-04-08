import React, { useRef, useState, useEffect, useContext, useCallback, createContext } from 'react';

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

var OrderGroupContext = React.createContext({
    others: [],
    setHoveredIndex: function () { return null; },
    config: {
        mode: 'between',
    },
});
var elementDataKey = 'orderableElement';
function OrderGroup(_a) {
    var _b;
    var children = _a.children, _c = _a.mode, mode = _c === void 0 ? 'between' : _c, props = __rest(_a, ["children", "mode"]);
    var ref = useRef();
    var _d = useState({
        others: ((_b = ref === null || ref === void 0 ? void 0 : ref.current) === null || _b === void 0 ? void 0 : _b.childNodes)
            ? Array.from(ref.current.childNodes).map(function (x) { return x; })
            : [],
        setHoveredIndex: function (i) { return setValue(function (p) { return (__assign(__assign({}, p), { hoveredIndex: i })); }); },
        config: {
            mode: mode,
        },
    }), value = _d[0], setValue = _d[1];
    useEffect(function () {
        setValue(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), { others: Array.from(((_a = ref === null || ref === void 0 ? void 0 : ref.current) === null || _a === void 0 ? void 0 : _a.childNodes) || [])
                    .map(function (x) { return x; })
                    .filter(function (x) { return !!x.dataset[elementDataKey]; }) }));
        });
    }, [children]);
    return (React.createElement(OrderGroupContext.Provider, { value: value },
        React.createElement("div", __assign({ ref: ref }, props), children)));
}

var useIsMounted = function () {
    var ref = useRef(false);
    var _a = useState(false), setIsMounted = _a[1];
    useEffect(function () {
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
var calculateDistance = function (config) { return function (el, pos) {
    if (config.mode === 'between') {
        return Math.abs(el.getBoundingClientRect().top - pos.clientY);
    }
    var half = el.getBoundingClientRect().height;
    return Math.abs(el.getBoundingClientRect().top + half - pos.clientY);
}; };
function useOrder(_a) {
    var _b;
    var ref = _a.elementRef, wrapperRef = _a.wrapperRef, index = _a.index, onMove = _a.onMove;
    var _c = useState(false), isGrabbing = _c[0], setIsGrabbing = _c[1];
    var _d = useState([0, 0]), offset = _d[0], setOffset = _d[1];
    var closestIndex = React.useRef();
    var isMounted = useIsMounted();
    var _e = useContext(OrderGroupContext), others = _e.others, hoveredIndex = _e.hoveredIndex, setHoveredIndex = _e.setHoveredIndex, config = _e.config;
    var calcDist = calculateDistance(config);
    var dragMove = useCallback(function (e, pos) {
        if (!isGrabbing)
            return;
        if (e)
            pauseEvent(e);
        ref.current.style.transform = "translate(" + (pos.pageX - offset[0]) + "px, " + (pos.pageY - offset[1]) + "px)";
        var elementIndex = others.reduce(function (prev, el, i) {
            if (prev === -1)
                return i;
            return calcDist(el, pos) < calcDist(others[prev], pos) ? i : prev;
        }, -1);
        closestIndex.current = elementIndex;
        if (config.mode === 'between' &&
            (elementIndex > index ? elementIndex - 1 : elementIndex) !== index) {
            setHoveredIndex(elementIndex);
        }
        else if (config.mode !== 'between' && elementIndex !== index) {
            setHoveredIndex(elementIndex);
        }
        else {
            setHoveredIndex(undefined);
        }
    }, [isGrabbing, offset, ref, others, index, setHoveredIndex, config.mode, calcDist]);
    var dragStart = useCallback(function (e, pos) {
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
    var dragEnd = useCallback(function () {
        if (!isGrabbing)
            return;
        var i = closestIndex.current;
        if (i !== undefined) {
            if (config.mode === 'between' && i > index)
                i -= 1;
            if (i !== index) {
                onMove(i);
            }
        }
        // closestElement.current?.classList?.remove(hoverClassName);
        if (ref.current)
            ref.current.style.transform = '';
        closestIndex.current = undefined;
        setHoveredIndex(undefined);
        if (isMounted()) {
            setIsGrabbing(false);
        }
    }, [isGrabbing, index, isMounted, onMove, ref, setHoveredIndex, config.mode]);
    var mouseDown = function (e) { return dragStart(e, e); };
    var mouseMove = function (e) { return dragMove(e, e); };
    var touchStart = function (e) { return dragStart(null, e.touches[0]); };
    var touchMove = function (e) { return dragMove(null, e.touches[0]); };
    useEffect(function () {
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
        isHover: hoveredIndex === index,
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

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var classnames = createCommonjsModule(function (module) {
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if (module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else {
		window.classNames = classNames;
	}
}());
});

var OrderItemContext = createContext({
    mouseDown: function () { return null; },
    touchStart: function () { return null; },
});
function OrderItem(_a) {
    var children = _a.children, index = _a.index, onMove = _a.onMove, style = _a.style, _b = _a.wrapperClassName, wrapperClassName = _b === void 0 ? '' : _b, _c = _a.wrapperHoverClassName, wrapperHoverClassName = _c === void 0 ? '' : _c, _d = _a.wrapperStyle, wrapperStyle = _d === void 0 ? {} : _d, _e = _a.wrapperHoverStyle, wrapperHoverStyle = _e === void 0 ? {} : _e, _f = _a.className, className = _f === void 0 ? '' : _f, _g = _a.inactiveStyle, inactiveStyle = _g === void 0 ? {} : _g, _h = _a.grabbingStyle, grabbingStyle = _h === void 0 ? {} : _h, _j = _a.inactiveClassName, inactiveClassName = _j === void 0 ? '' : _j, _k = _a.grabbingClassName, grabbingClassName = _k === void 0 ? '' : _k, _l = _a.hoverClassName, hoverClassName = _l === void 0 ? '' : _l, _m = _a.hoverStyle, hoverStyle = _m === void 0 ? {} : _m;
    var elementRef = useRef();
    var wrapperRef = useRef();
    var _o = useOrder({
        elementRef: elementRef,
        wrapperRef: wrapperRef,
        index: index,
        onMove: onMove,
    }), mouseDown = _o.mouseDown, mouseMove = _o.mouseMove, touchStart = _o.touchStart, touchMove = _o.touchMove, isGrabbing = _o.isGrabbing, isHover = _o.isHover, elementStyle = _o.elementStyle;
    var context = useState({
        mouseDown: mouseDown,
        touchStart: touchStart,
    })[0];
    return (React.createElement("div", { ref: wrapperRef, className: classnames(wrapperClassName, isHover && wrapperHoverClassName), style: __assign(__assign({}, wrapperStyle), (isHover ? wrapperHoverStyle : {})) },
        React.createElement("div", { ref: elementRef, className: classnames(className, isGrabbing && grabbingClassName, !isGrabbing && inactiveClassName, isHover && hoverClassName), style: __assign(__assign(__assign(__assign({}, elementStyle), style), (isGrabbing ? grabbingStyle : inactiveStyle)), (isHover ? hoverStyle : {})), onMouseMove: mouseMove, onTouchMove: touchMove },
            React.createElement(OrderItemContext.Provider, { value: context }, children))));
}
OrderItem.Handle = function OrderItemHandle(_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var _b = useContext(OrderItemContext), mouseDown = _b.mouseDown, touchStart = _b.touchStart;
    return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    React.createElement("div", __assign({ onMouseDown: mouseDown, onTouchStart: touchStart }, props), children));
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
    wrapperHoverClassName: 'rdo-hover',
    className: 'rdo-item',
    grabbingClassName: 'rdo-item-grabbing',
};
var group = {
    className: 'rdo-group',
    mode: 'between',
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

export { OrderGroup, OrderItem, arrayMove, index as defaultTheme, useOrder };
//# sourceMappingURL=index.es.js.map
