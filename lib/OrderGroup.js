var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import React, { useEffect, useState } from 'react';
export var OrderGroupContext = React.createContext({
    others: [],
});
export var elementDataKey = 'orderableElement';
export default function OrderGroup(_a) {
    var _b;
    var children = _a.children;
    var ref = React.useRef();
    var _c = __read(useState({
        others: ((_b = ref === null || ref === void 0 ? void 0 : ref.current) === null || _b === void 0 ? void 0 : _b.childNodes) ? Array.from(ref.current.childNodes).map(function (x) { return x; }) : [],
    }), 2), value = _c[0], setValue = _c[1];
    useEffect(function () {
        setValue(__assign(__assign({}, value), { get others() {
                return Array.from(ref.current.childNodes)
                    .map(function (x) { return x; })
                    .filter(function (x) { return !!x.dataset[elementDataKey]; });
            } }));
    }, [ref.current]);
    return (React.createElement(OrderGroupContext.Provider, { value: value },
        React.createElement("div", { ref: ref }, children)));
}
