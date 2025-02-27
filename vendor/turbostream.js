(function () {
var $8038ee37bf9c868b$exports = {};
function $d1e9370853ff8484$var$asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) resolve(value);
    else Promise.resolve(value).then(_next, _throw);
}
function $d1e9370853ff8484$export$71511d61b312f219(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                $d1e9370853ff8484$var$asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                $d1e9370853ff8484$var$asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}


function $f6164edf053e4083$export$71511d61b312f219(arr) {
    if (Array.isArray(arr)) return arr;
}


function $6dec4ce864e0eaa6$export$71511d61b312f219(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}


function $092fde99d32800e5$export$71511d61b312f219() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}


function $36ca941bce93f1c7$export$71511d61b312f219(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}


function $cfc31108d06efd09$export$71511d61b312f219(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return (0, $36ca941bce93f1c7$export$71511d61b312f219)(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0, $36ca941bce93f1c7$export$71511d61b312f219)(o, minLen);
}


function $e3406d20bd91f5ca$export$71511d61b312f219(arr, i) {
    return (0, $f6164edf053e4083$export$71511d61b312f219)(arr) || (0, $6dec4ce864e0eaa6$export$71511d61b312f219)(arr, i) || (0, $cfc31108d06efd09$export$71511d61b312f219)(arr, i) || (0, $092fde99d32800e5$export$71511d61b312f219)();
}


function $bddf2f8f9387a36f$export$71511d61b312f219(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}


/******************************************************************************
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
***************************************************************************** */ /* global Reflect, Promise, SuppressedError, Symbol, Iterator */ 
var $3d92a16ff8bdcfc3$var$extendStatics = function extendStatics1(d, b) {
    $3d92a16ff8bdcfc3$var$extendStatics = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(d, b) {
        d.__proto__ = b;
    } || function(d, b) {
        for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };
    return $3d92a16ff8bdcfc3$var$extendStatics(d, b);
};
function $3d92a16ff8bdcfc3$export$a8ba968b8961cb8a(d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    $3d92a16ff8bdcfc3$var$extendStatics(d, b);
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var $3d92a16ff8bdcfc3$export$18ce0697a983be9b = function __assign1() {
    $3d92a16ff8bdcfc3$export$18ce0697a983be9b = Object.assign || function __assign(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return $3d92a16ff8bdcfc3$export$18ce0697a983be9b.apply(this, arguments);
};
function $3d92a16ff8bdcfc3$export$3c9a16f847548506(s, e) {
    var t = {};
    for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") {
        for(var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
}
function $3d92a16ff8bdcfc3$export$29e00dfd3077644b(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if ((typeof Reflect === "undefined" ? "undefined" : (0, $bddf2f8f9387a36f$export$71511d61b312f219)(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function $3d92a16ff8bdcfc3$export$d5ad3fd78186038f(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
function $3d92a16ff8bdcfc3$export$3a84e1ae4e97e9b0(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) {
        if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
        return f;
    }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for(var i = decorators.length - 1; i >= 0; i--){
        var context = {};
        for(var p in contextIn)context[p] = p === "access" ? {} : contextIn[p];
        for(var p in contextIn.access)context.access[p] = contextIn.access[p];
        context.addInitializer = function(f) {
            if (done) throw new TypeError("Cannot add initializers after decoration has completed");
            extraInitializers.push(accept(f || null));
        };
        var result = (0, decorators[i])(kind === "accessor" ? {
            get: descriptor.get,
            set: descriptor.set
        } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || (typeof result === "undefined" ? "undefined" : (0, $bddf2f8f9387a36f$export$71511d61b312f219)(result)) !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        } else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
}
function $3d92a16ff8bdcfc3$export$d831c04e792af3d(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for(var i = 0; i < initializers.length; i++)value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    return useValue ? value : void 0;
}
function $3d92a16ff8bdcfc3$export$6a2a36740a146cb8(x) {
    return (typeof x === "undefined" ? "undefined" : (0, $bddf2f8f9387a36f$export$71511d61b312f219)(x)) === "symbol" ? x : "".concat(x);
}
function $3d92a16ff8bdcfc3$export$d1a06452d3489bc7(f, name, prefix) {
    if ((typeof name === "undefined" ? "undefined" : (0, $bddf2f8f9387a36f$export$71511d61b312f219)(name)) === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", {
        configurable: true,
        value: prefix ? "".concat(prefix, " ", name) : name
    });
}
function $3d92a16ff8bdcfc3$export$f1db080c865becb9(metadataKey, metadataValue) {
    if ((typeof Reflect === "undefined" ? "undefined" : (0, $bddf2f8f9387a36f$export$71511d61b312f219)(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function $3d92a16ff8bdcfc3$export$1050f835b63b671e(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}
function $3d92a16ff8bdcfc3$export$67ebef60e6f28a6(thisArg, body) {
    var _ = {
        label: 0,
        sent: function sent() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var $3d92a16ff8bdcfc3$export$45d3717a4c69092e = Object.create ? function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
        enumerable: true,
        get: function get() {
            return m[k];
        }
    };
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
};
function $3d92a16ff8bdcfc3$export$f33643c0debef087(m, o) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) $3d92a16ff8bdcfc3$export$45d3717a4c69092e(o, m, p);
}
function $3d92a16ff8bdcfc3$export$19a8beecd37a4c45(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function next() {
            if (o && i >= o.length) o = void 0;
            return {
                value: o && o[i++],
                done: !o
            };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function $3d92a16ff8bdcfc3$export$8d051b38c9118094(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
}
function $3d92a16ff8bdcfc3$export$afc72e2116322959() {
    for(var ar = [], i = 0; i < arguments.length; i++)ar = ar.concat($3d92a16ff8bdcfc3$export$8d051b38c9118094(arguments[i]));
    return ar;
}
function $3d92a16ff8bdcfc3$export$6388937ca91ccae8() {
    for(var s = 0, i = 0, il = arguments.length; i < il; i++)s += arguments[i].length;
    for(var r = Array(s), k = 0, i = 0; i < il; i++)for(var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)r[k] = a[j];
    return r;
}
function $3d92a16ff8bdcfc3$export$1216008129fb82ed(to, from, pack) {
    if (pack || arguments.length === 2) {
        for(var i = 0, l = from.length, ar; i < l; i++)if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}
function $3d92a16ff8bdcfc3$export$10c90e4f7922046c(v) {
    return this instanceof $3d92a16ff8bdcfc3$export$10c90e4f7922046c ? (this.v = v, this) : new $3d92a16ff8bdcfc3$export$10c90e4f7922046c(v);
}
function $3d92a16ff8bdcfc3$export$e427f37a30a4de9b(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
        return this;
    }, i;
    function awaitReturn(f) {
        return function(v) {
            return Promise.resolve(v).then(f, reject);
        };
    }
    function verb(n, f) {
        if (g[n]) {
            i[n] = function(v) {
                return new Promise(function(a, b) {
                    q.push([
                        n,
                        v,
                        a,
                        b
                    ]) > 1 || resume(n, v);
                });
            };
            if (f) i[n] = f(i[n]);
        }
    }
    function resume(n, v) {
        try {
            step(g[n](v));
        } catch (e) {
            settle(q[0][3], e);
        }
    }
    function step(r) {
        r.value instanceof $3d92a16ff8bdcfc3$export$10c90e4f7922046c ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
        resume("next", value);
    }
    function reject(value) {
        resume("throw", value);
    }
    function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
}
function $3d92a16ff8bdcfc3$export$bbd80228419bb833(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function(e) {
        throw e;
    }), verb("return"), i[Symbol.iterator] = function() {
        return this;
    }, i;
    function verb(n, f) {
        i[n] = o[n] ? function(v) {
            return (p = !p) ? {
                value: $3d92a16ff8bdcfc3$export$10c90e4f7922046c(o[n](v)),
                done: false
            } : f ? f(v) : v;
        } : f;
    }
}
function $3d92a16ff8bdcfc3$export$e3b29a3d6162315f(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof $3d92a16ff8bdcfc3$export$19a8beecd37a4c45 === "function" ? $3d92a16ff8bdcfc3$export$19a8beecd37a4c45(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
    }, i);
    function verb(n) {
        i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
                v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
        };
    }
    function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function(v) {
            resolve({
                value: v,
                done: d
            });
        }, reject);
    }
}
function $3d92a16ff8bdcfc3$export$4fb47efe1390b86f(cooked, raw) {
    if (Object.defineProperty) Object.defineProperty(cooked, "raw", {
        value: raw
    });
    else cooked.raw = raw;
    return cooked;
}
var $3d92a16ff8bdcfc3$var$__setModuleDefault = Object.create ? function __setModuleDefault(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
};
var $3d92a16ff8bdcfc3$var$ownKeys = function ownKeys1(o) {
    $3d92a16ff8bdcfc3$var$ownKeys = Object.getOwnPropertyNames || function(o) {
        var ar = [];
        for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
        return ar;
    };
    return $3d92a16ff8bdcfc3$var$ownKeys(o);
};
function $3d92a16ff8bdcfc3$export$c21735bcef00d192(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k = $3d92a16ff8bdcfc3$var$ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") $3d92a16ff8bdcfc3$export$45d3717a4c69092e(result, mod, k[i]);
    }
    $3d92a16ff8bdcfc3$var$__setModuleDefault(result, mod);
    return result;
}
function $3d92a16ff8bdcfc3$export$da59b14a69baef04(mod) {
    return mod && mod.__esModule ? mod : {
        default: mod
    };
}
function $3d92a16ff8bdcfc3$export$d5dcaf168c640c35(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function $3d92a16ff8bdcfc3$export$d40a35129aaff81f(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function $3d92a16ff8bdcfc3$export$81fdc39f203e4e04(state, receiver) {
    if (receiver === null || (typeof receiver === "undefined" ? "undefined" : (0, $bddf2f8f9387a36f$export$71511d61b312f219)(receiver)) !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}
function $3d92a16ff8bdcfc3$export$88ac25d8e944e405(env, value, async) {
    if (value !== null && value !== void 0) {
        if ((typeof value === "undefined" ? "undefined" : (0, $bddf2f8f9387a36f$export$71511d61b312f219)(value)) !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function dispose() {
            try {
                inner.call(this);
            } catch (e) {
                return Promise.reject(e);
            }
        };
        env.stack.push({
            value: value,
            dispose: dispose,
            async: async
        });
    } else if (async) env.stack.push({
        async: true
    });
    return value;
}
var $3d92a16ff8bdcfc3$var$_SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function _SuppressedError(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function $3d92a16ff8bdcfc3$export$8f076105dc360e92(env) {
    function fail(e) {
        env.error = env.hasError ? new $3d92a16ff8bdcfc3$var$_SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }
    var r, s = 0;
    function next() {
        while(r = env.stack.pop())try {
            if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
            if (r.dispose) {
                var result = r.dispose.call(r.value);
                if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
                    fail(e);
                    return next();
                });
            } else s |= 1;
        } catch (e) {
            fail(e);
        }
        if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
        if (env.hasError) throw env.error;
    }
    return next();
}
function $3d92a16ff8bdcfc3$export$889dfb5d17574b0b(path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
        return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
    });
    return path;
}
var $3d92a16ff8bdcfc3$export$2e2bcd8739ae039 = {
    __extends: $3d92a16ff8bdcfc3$export$a8ba968b8961cb8a,
    __assign: $3d92a16ff8bdcfc3$export$18ce0697a983be9b,
    __rest: $3d92a16ff8bdcfc3$export$3c9a16f847548506,
    __decorate: $3d92a16ff8bdcfc3$export$29e00dfd3077644b,
    __param: $3d92a16ff8bdcfc3$export$d5ad3fd78186038f,
    __esDecorate: $3d92a16ff8bdcfc3$export$3a84e1ae4e97e9b0,
    __runInitializers: $3d92a16ff8bdcfc3$export$d831c04e792af3d,
    __propKey: $3d92a16ff8bdcfc3$export$6a2a36740a146cb8,
    __setFunctionName: $3d92a16ff8bdcfc3$export$d1a06452d3489bc7,
    __metadata: $3d92a16ff8bdcfc3$export$f1db080c865becb9,
    __awaiter: $3d92a16ff8bdcfc3$export$1050f835b63b671e,
    __generator: $3d92a16ff8bdcfc3$export$67ebef60e6f28a6,
    __createBinding: $3d92a16ff8bdcfc3$export$45d3717a4c69092e,
    __exportStar: $3d92a16ff8bdcfc3$export$f33643c0debef087,
    __values: $3d92a16ff8bdcfc3$export$19a8beecd37a4c45,
    __read: $3d92a16ff8bdcfc3$export$8d051b38c9118094,
    __spread: $3d92a16ff8bdcfc3$export$afc72e2116322959,
    __spreadArrays: $3d92a16ff8bdcfc3$export$6388937ca91ccae8,
    __spreadArray: $3d92a16ff8bdcfc3$export$1216008129fb82ed,
    __await: $3d92a16ff8bdcfc3$export$10c90e4f7922046c,
    __asyncGenerator: $3d92a16ff8bdcfc3$export$e427f37a30a4de9b,
    __asyncDelegator: $3d92a16ff8bdcfc3$export$bbd80228419bb833,
    __asyncValues: $3d92a16ff8bdcfc3$export$e3b29a3d6162315f,
    __makeTemplateObject: $3d92a16ff8bdcfc3$export$4fb47efe1390b86f,
    __importStar: $3d92a16ff8bdcfc3$export$c21735bcef00d192,
    __importDefault: $3d92a16ff8bdcfc3$export$da59b14a69baef04,
    __classPrivateFieldGet: $3d92a16ff8bdcfc3$export$d5dcaf168c640c35,
    __classPrivateFieldSet: $3d92a16ff8bdcfc3$export$d40a35129aaff81f,
    __classPrivateFieldIn: $3d92a16ff8bdcfc3$export$81fdc39f203e4e04,
    __addDisposableResource: $3d92a16ff8bdcfc3$export$88ac25d8e944e405,
    __disposeResources: $3d92a16ff8bdcfc3$export$8f076105dc360e92,
    __rewriteRelativeImportExtension: $3d92a16ff8bdcfc3$export$889dfb5d17574b0b
};


"use strict";
Object.defineProperty($8038ee37bf9c868b$exports, "__esModule", {
    value: true
});
$8038ee37bf9c868b$exports.encode = $8038ee37bf9c868b$exports.decode = void 0;
var $cb2299d6261abd9c$exports = {};


function $b424a9abf016e439$export$71511d61b312f219(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}




function $78f41d2a271c854a$export$71511d61b312f219(arr) {
    return (0, $f6164edf053e4083$export$71511d61b312f219)(arr) || (0, $b424a9abf016e439$export$71511d61b312f219)(arr) || (0, $cfc31108d06efd09$export$71511d61b312f219)(arr) || (0, $092fde99d32800e5$export$71511d61b312f219)();
}



function $b84912ad86c9ce6f$export$71511d61b312f219(arr) {
    if (Array.isArray(arr)) return (0, $36ca941bce93f1c7$export$71511d61b312f219)(arr);
}



function $1f2ccb10d71bd45a$export$71511d61b312f219() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}



function $34618e712334dec5$export$71511d61b312f219(arr) {
    return (0, $b84912ad86c9ce6f$export$71511d61b312f219)(arr) || (0, $b424a9abf016e439$export$71511d61b312f219)(arr) || (0, $cfc31108d06efd09$export$71511d61b312f219)(arr) || (0, $1f2ccb10d71bd45a$export$71511d61b312f219)();
}



"use strict";
Object.defineProperty($cb2299d6261abd9c$exports, "__esModule", {
    value: true
});
$cb2299d6261abd9c$exports.flatten = void 0;
var $65e201d365740f11$exports = {};
function $ab3a094495a865ee$export$71511d61b312f219(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}


function $a15628583efdb184$export$71511d61b312f219(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}


"use strict";
Object.defineProperty($65e201d365740f11$exports, "__esModule", {
    value: true
});
$65e201d365740f11$exports.createLineSplittingTransform = $65e201d365740f11$exports.Deferred = $65e201d365740f11$exports.TYPE_PREVIOUS_RESOLVED = $65e201d365740f11$exports.TYPE_URL = $65e201d365740f11$exports.TYPE_SYMBOL = $65e201d365740f11$exports.TYPE_SET = $65e201d365740f11$exports.TYPE_REGEXP = $65e201d365740f11$exports.TYPE_PROMISE = $65e201d365740f11$exports.TYPE_NULL_OBJECT = $65e201d365740f11$exports.TYPE_MAP = $65e201d365740f11$exports.TYPE_ERROR = $65e201d365740f11$exports.TYPE_DATE = $65e201d365740f11$exports.TYPE_BIGINT = $65e201d365740f11$exports.UNDEFINED = $65e201d365740f11$exports.POSITIVE_INFINITY = $65e201d365740f11$exports.NULL = $65e201d365740f11$exports.NEGATIVE_ZERO = $65e201d365740f11$exports.NEGATIVE_INFINITY = $65e201d365740f11$exports.NAN = $65e201d365740f11$exports.HOLE = void 0;
$65e201d365740f11$exports.HOLE = -1;
$65e201d365740f11$exports.NAN = -2;
$65e201d365740f11$exports.NEGATIVE_INFINITY = -3;
$65e201d365740f11$exports.NEGATIVE_ZERO = -4;
$65e201d365740f11$exports.NULL = -5;
$65e201d365740f11$exports.POSITIVE_INFINITY = -6;
$65e201d365740f11$exports.UNDEFINED = -7;
$65e201d365740f11$exports.TYPE_BIGINT = "B";
$65e201d365740f11$exports.TYPE_DATE = "D";
$65e201d365740f11$exports.TYPE_ERROR = "E";
$65e201d365740f11$exports.TYPE_MAP = "M";
$65e201d365740f11$exports.TYPE_NULL_OBJECT = "N";
$65e201d365740f11$exports.TYPE_PROMISE = "P";
$65e201d365740f11$exports.TYPE_REGEXP = "R";
$65e201d365740f11$exports.TYPE_SET = "S";
$65e201d365740f11$exports.TYPE_SYMBOL = "Y";
$65e201d365740f11$exports.TYPE_URL = "U";
$65e201d365740f11$exports.TYPE_PREVIOUS_RESOLVED = "Z";
var $65e201d365740f11$var$Deferred = function Deferred() {
    var _this = this;
    (0, $ab3a094495a865ee$export$71511d61b312f219)(this, Deferred);
    (0, $a15628583efdb184$export$71511d61b312f219)(this, "promise", void 0);
    (0, $a15628583efdb184$export$71511d61b312f219)(this, "resolve", void 0);
    (0, $a15628583efdb184$export$71511d61b312f219)(this, "reject", void 0);
    this.promise = new Promise(function(resolve, reject) {
        _this.resolve = resolve;
        _this.reject = reject;
    });
};
$65e201d365740f11$exports.Deferred = $65e201d365740f11$var$Deferred;
function $65e201d365740f11$var$createLineSplittingTransform() {
    var decoder = new TextDecoder();
    var leftover = "";
    return new TransformStream({
        transform: function(chunk, controller) {
            var str = decoder.decode(chunk, {
                stream: true
            });
            var parts = (leftover + str).split("\n");
            // The last part might be a partial line, so keep it for the next chunk.
            leftover = parts.pop() || "";
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var part = _step.value;
                    controller.enqueue(part);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        },
        flush: function(controller) {
            // If there's any leftover data, enqueue it before closing.
            if (leftover) controller.enqueue(leftover);
        }
    });
}
$65e201d365740f11$exports.createLineSplittingTransform = $65e201d365740f11$var$createLineSplittingTransform;


function $cb2299d6261abd9c$var$flatten(input) {
    var indices = this.indices;
    var existing = indices.get(input);
    if (existing) return [
        existing
    ];
    if (input === undefined) return $65e201d365740f11$exports.UNDEFINED;
    if (input === null) return $65e201d365740f11$exports.NULL;
    if (Number.isNaN(input)) return $65e201d365740f11$exports.NAN;
    if (input === Number.POSITIVE_INFINITY) return $65e201d365740f11$exports.POSITIVE_INFINITY;
    if (input === Number.NEGATIVE_INFINITY) return $65e201d365740f11$exports.NEGATIVE_INFINITY;
    if (input === 0 && 1 / input < 0) return $65e201d365740f11$exports.NEGATIVE_ZERO;
    var index = this.index++;
    indices.set(input, index);
    $cb2299d6261abd9c$var$stringify.call(this, input, index);
    return index;
}
$cb2299d6261abd9c$exports.flatten = $cb2299d6261abd9c$var$flatten;
function $cb2299d6261abd9c$var$stringify(input, index) {
    var _this = this;
    var _this1 = this, deferred = _this1.deferred, plugins = _this1.plugins, postPlugins = _this1.postPlugins;
    var str = this.stringified;
    var stack = [
        [
            input,
            index
        ]
    ];
    while(stack.length > 0){
        var _stack_pop = (0, $e3406d20bd91f5ca$export$71511d61b312f219)(stack.pop(), 2), _$input = _stack_pop[0], _$index = _stack_pop[1];
        var partsForObj = function(obj) {
            return Object.keys(obj).map(function(k) {
                return '"_'.concat($cb2299d6261abd9c$var$flatten.call(_this, k), '":').concat($cb2299d6261abd9c$var$flatten.call(_this, obj[k]));
            }).join(",");
        };
        var error = null;
        switch(typeof _$input === "undefined" ? "undefined" : (0, $bddf2f8f9387a36f$export$71511d61b312f219)(_$input)){
            case "boolean":
            case "number":
            case "string":
                str[_$index] = JSON.stringify(_$input);
                break;
            case "bigint":
                str[_$index] = '["'.concat($65e201d365740f11$exports.TYPE_BIGINT, '","').concat(_$input, '"]');
                break;
            case "symbol":
                {
                    var keyFor = Symbol.keyFor(_$input);
                    if (!keyFor) error = new Error("Cannot encode symbol unless created with Symbol.for()");
                    else str[_$index] = '["'.concat($65e201d365740f11$exports.TYPE_SYMBOL, '",').concat(JSON.stringify(keyFor), "]");
                    break;
                }
            case "object":
                {
                    if (!_$input) {
                        str[_$index] = "".concat($65e201d365740f11$exports.NULL);
                        break;
                    }
                    var isArray = Array.isArray(_$input);
                    var pluginHandled = false;
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    if (!isArray && plugins) try {
                        for(var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var plugin = _step.value;
                            var pluginResult = plugin(_$input);
                            if (Array.isArray(pluginResult)) {
                                pluginHandled = true;
                                var _pluginResult = (0, $78f41d2a271c854a$export$71511d61b312f219)(pluginResult), pluginIdentifier = _pluginResult[0], rest = _pluginResult.slice(1);
                                str[_$index] = "[".concat(JSON.stringify(pluginIdentifier));
                                if (rest.length > 0) str[_$index] += ",".concat(rest.map(function(v) {
                                    return $cb2299d6261abd9c$var$flatten.call(_this, v);
                                }).join(","));
                                str[_$index] += "]";
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    if (!pluginHandled) {
                        var result = isArray ? "[" : "{";
                        if (isArray) {
                            for(var i = 0; i < _$input.length; i++)result += (i ? "," : "") + (i in _$input ? $cb2299d6261abd9c$var$flatten.call(this, _$input[i]) : $65e201d365740f11$exports.HOLE);
                            str[_$index] = "".concat(result, "]");
                        } else if (_$input instanceof Date) str[_$index] = '["'.concat($65e201d365740f11$exports.TYPE_DATE, '",').concat(_$input.getTime(), "]");
                        else if (_$input instanceof URL) str[_$index] = '["'.concat($65e201d365740f11$exports.TYPE_URL, '",').concat(JSON.stringify(_$input.href), "]");
                        else if (_$input instanceof RegExp) str[_$index] = '["'.concat($65e201d365740f11$exports.TYPE_REGEXP, '",').concat(JSON.stringify(_$input.source), ",").concat(JSON.stringify(_$input.flags), "]");
                        else if (_$input instanceof Set) {
                            if (_$input.size > 0) str[_$index] = '["'.concat($65e201d365740f11$exports.TYPE_SET, '",').concat((0, $34618e712334dec5$export$71511d61b312f219)(_$input).map(function(val) {
                                return $cb2299d6261abd9c$var$flatten.call(_this, val);
                            }).join(","), "]");
                            else str[_$index] = '["'.concat($65e201d365740f11$exports.TYPE_SET, '"]');
                        } else if (_$input instanceof Map) {
                            if (_$input.size > 0) str[_$index] = '["'.concat($65e201d365740f11$exports.TYPE_MAP, '",').concat((0, $34618e712334dec5$export$71511d61b312f219)(_$input).flatMap(function(param) {
                                var _param = (0, $e3406d20bd91f5ca$export$71511d61b312f219)(param, 2), k = _param[0], v = _param[1];
                                return [
                                    $cb2299d6261abd9c$var$flatten.call(_this, k),
                                    $cb2299d6261abd9c$var$flatten.call(_this, v)
                                ];
                            }).join(","), "]");
                            else str[_$index] = '["'.concat($65e201d365740f11$exports.TYPE_MAP, '"]');
                        } else if (_$input instanceof Promise) {
                            str[_$index] = '["'.concat($65e201d365740f11$exports.TYPE_PROMISE, '",').concat(_$index, "]");
                            deferred[_$index] = _$input;
                        } else if (_$input instanceof Error) {
                            str[_$index] = '["'.concat($65e201d365740f11$exports.TYPE_ERROR, '",').concat(JSON.stringify(_$input.message));
                            if (_$input.name !== "Error") str[_$index] += ",".concat(JSON.stringify(_$input.name));
                            str[_$index] += "]";
                        } else if (Object.getPrototypeOf(_$input) === null) str[_$index] = '["'.concat($65e201d365740f11$exports.TYPE_NULL_OBJECT, '",{').concat(partsForObj(_$input), "}]");
                        else if ($cb2299d6261abd9c$var$isPlainObject(_$input)) str[_$index] = "{".concat(partsForObj(_$input), "}");
                        else error = new Error("Cannot encode object with prototype");
                    }
                    break;
                }
            default:
                {
                    var isArray1 = Array.isArray(_$input);
                    var pluginHandled1 = false;
                    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    if (!isArray1 && plugins) try {
                        for(var _iterator1 = plugins[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                            var plugin1 = _step1.value;
                            var pluginResult1 = plugin1(_$input);
                            if (Array.isArray(pluginResult1)) {
                                pluginHandled1 = true;
                                var _pluginResult1 = (0, $78f41d2a271c854a$export$71511d61b312f219)(pluginResult1), pluginIdentifier1 = _pluginResult1[0], rest1 = _pluginResult1.slice(1);
                                str[_$index] = "[".concat(JSON.stringify(pluginIdentifier1));
                                if (rest1.length > 0) str[_$index] += ",".concat(rest1.map(function(v) {
                                    return $cb2299d6261abd9c$var$flatten.call(_this, v);
                                }).join(","));
                                str[_$index] += "]";
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError1 = true;
                        _iteratorError1 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                _iterator1.return();
                            }
                        } finally{
                            if (_didIteratorError1) {
                                throw _iteratorError1;
                            }
                        }
                    }
                    if (!pluginHandled1) error = new Error("Cannot encode function or unexpected type");
                }
        }
        if (error) {
            var pluginHandled2 = false;
            var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
            if (postPlugins) try {
                for(var _iterator2 = postPlugins[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                    var plugin2 = _step2.value;
                    var pluginResult2 = plugin2(_$input);
                    if (Array.isArray(pluginResult2)) {
                        pluginHandled2 = true;
                        var _pluginResult2 = (0, $78f41d2a271c854a$export$71511d61b312f219)(pluginResult2), pluginIdentifier2 = _pluginResult2[0], rest2 = _pluginResult2.slice(1);
                        str[_$index] = "[".concat(JSON.stringify(pluginIdentifier2));
                        if (rest2.length > 0) str[_$index] += ",".concat(rest2.map(function(v) {
                            return $cb2299d6261abd9c$var$flatten.call(_this, v);
                        }).join(","));
                        str[_$index] += "]";
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                        _iterator2.return();
                    }
                } finally{
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
            if (!pluginHandled2) throw error;
        }
    }
}
var $cb2299d6261abd9c$var$objectProtoNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function $cb2299d6261abd9c$var$isPlainObject(thing) {
    var proto = Object.getPrototypeOf(thing);
    return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === $cb2299d6261abd9c$var$objectProtoNames;
}


var $6aafc7ae685fcf56$exports = {};



"use strict";
Object.defineProperty($6aafc7ae685fcf56$exports, "__esModule", {
    value: true
});
$6aafc7ae685fcf56$exports.unflatten = void 0;

var $6aafc7ae685fcf56$var$globalObj = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : undefined;
function $6aafc7ae685fcf56$var$unflatten(parsed) {
    var _this = this, hydrated = _this.hydrated, values = _this.values;
    if (typeof parsed === "number") return $6aafc7ae685fcf56$var$hydrate.call(this, parsed);
    if (!Array.isArray(parsed) || !parsed.length) throw new SyntaxError();
    var startIndex = values.length;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = parsed[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var value = _step.value;
            values.push(value);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    hydrated.length = values.length;
    return $6aafc7ae685fcf56$var$hydrate.call(this, startIndex);
}
$6aafc7ae685fcf56$exports.unflatten = $6aafc7ae685fcf56$var$unflatten;
function $6aafc7ae685fcf56$var$hydrate(index) {
    var _loop = function() {
        var _stack_pop = (0, $e3406d20bd91f5ca$export$71511d61b312f219)(stack.pop(), 2), _$index = _stack_pop[0], set = _stack_pop[1];
        switch(_$index){
            case $65e201d365740f11$exports.UNDEFINED:
                set(undefined);
                return "continue";
            case $65e201d365740f11$exports.NULL:
                set(null);
                return "continue";
            case $65e201d365740f11$exports.NAN:
                set(NaN);
                return "continue";
            case $65e201d365740f11$exports.POSITIVE_INFINITY:
                set(Infinity);
                return "continue";
            case $65e201d365740f11$exports.NEGATIVE_INFINITY:
                set(-Infinity);
                return "continue";
            case $65e201d365740f11$exports.NEGATIVE_ZERO:
                set(-0);
                return "continue";
        }
        if (hydrated[_$index]) {
            set(hydrated[_$index]);
            return "continue";
        }
        var value = values[_$index];
        if (!value || (typeof value === "undefined" ? "undefined" : (0, $bddf2f8f9387a36f$export$71511d61b312f219)(value)) !== "object") {
            hydrated[_$index] = value;
            set(value);
            return "continue";
        }
        if (Array.isArray(value)) {
            if (typeof value[0] === "string") {
                var _value = (0, $e3406d20bd91f5ca$export$71511d61b312f219)(value, 3), type = _value[0], b = _value[1], c = _value[2];
                switch(type){
                    case $65e201d365740f11$exports.TYPE_DATE:
                        set(hydrated[_$index] = new Date(b));
                        return "continue";
                    case $65e201d365740f11$exports.TYPE_URL:
                        set(hydrated[_$index] = new URL(b));
                        return "continue";
                    case $65e201d365740f11$exports.TYPE_BIGINT:
                        set(hydrated[_$index] = BigInt(b));
                        return "continue";
                    case $65e201d365740f11$exports.TYPE_REGEXP:
                        set(hydrated[_$index] = new RegExp(b, c));
                        return "continue";
                    case $65e201d365740f11$exports.TYPE_SYMBOL:
                        set(hydrated[_$index] = Symbol.for(b));
                        return "continue";
                    case $65e201d365740f11$exports.TYPE_SET:
                        var newSet = new Set();
                        hydrated[_$index] = newSet;
                        for(var i = 1; i < value.length; i++)stack.push([
                            value[i],
                            function(v) {
                                newSet.add(v);
                            }
                        ]);
                        set(newSet);
                        return "continue";
                    case $65e201d365740f11$exports.TYPE_MAP:
                        var _loop = function(i1) {
                            var r = [];
                            stack.push([
                                value[i1 + 1],
                                function(v) {
                                    r[1] = v;
                                }
                            ]);
                            stack.push([
                                value[i1],
                                function(k) {
                                    r[0] = k;
                                }
                            ]);
                            postRun.push(function() {
                                map.set(r[0], r[1]);
                            });
                        };
                        var map = new Map();
                        hydrated[_$index] = map;
                        for(var i1 = 1; i1 < value.length; i1 += 2)_loop(i1);
                        set(map);
                        return "continue";
                    case $65e201d365740f11$exports.TYPE_NULL_OBJECT:
                        var obj = Object.create(null);
                        hydrated[_$index] = obj;
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            var _loop1 = function() {
                                var key = _step.value;
                                var r = [];
                                stack.push([
                                    b[key],
                                    function(v) {
                                        r[1] = v;
                                    }
                                ]);
                                stack.push([
                                    Number(key.slice(1)),
                                    function(k) {
                                        r[0] = k;
                                    }
                                ]);
                                postRun.push(function() {
                                    obj[r[0]] = r[1];
                                });
                            };
                            for(var _iterator = Object.keys(b).reverse()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop1();
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                        set(obj);
                        return "continue";
                    case $65e201d365740f11$exports.TYPE_PROMISE:
                        if (hydrated[b]) set(hydrated[_$index] = hydrated[b]);
                        else {
                            var d = new $65e201d365740f11$exports.Deferred();
                            deferred[b] = d;
                            set(hydrated[_$index] = d.promise);
                        }
                        return "continue";
                    case $65e201d365740f11$exports.TYPE_ERROR:
                        var _value1 = (0, $e3406d20bd91f5ca$export$71511d61b312f219)(value, 3), message = _value1[1], errorType = _value1[2];
                        var error = errorType && $6aafc7ae685fcf56$var$globalObj && $6aafc7ae685fcf56$var$globalObj[errorType] ? new $6aafc7ae685fcf56$var$globalObj[errorType](message) : new Error(message);
                        hydrated[_$index] = error;
                        set(error);
                        return "continue";
                    case $65e201d365740f11$exports.TYPE_PREVIOUS_RESOLVED:
                        set(hydrated[_$index] = hydrated[b]);
                        return "continue";
                    default:
                        // Run plugins at the end so we have a chance to resolve primitives
                        // without running into a loop
                        if (Array.isArray(plugins)) {
                            var _loop2 = function(i2) {
                                var v = vals[i2];
                                stack.push([
                                    v,
                                    function(v) {
                                        r[i2] = v;
                                    }
                                ]);
                            };
                            var r = [];
                            var vals = value.slice(1);
                            for(var i2 = 0; i2 < vals.length; i2++)_loop2(i2);
                            postRun.push(function() {
                                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                try {
                                    for(var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                        var plugin = _step.value;
                                        var result = plugin.apply(void 0, [
                                            value[0]
                                        ].concat((0, $34618e712334dec5$export$71511d61b312f219)(r)));
                                        if (result) {
                                            set(hydrated[_$index] = result.value);
                                            return;
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError = true;
                                    _iteratorError = err;
                                } finally{
                                    try {
                                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                                            _iterator.return();
                                        }
                                    } finally{
                                        if (_didIteratorError) {
                                            throw _iteratorError;
                                        }
                                    }
                                }
                                throw new SyntaxError();
                            });
                            return "continue";
                        }
                        throw new SyntaxError();
                }
            } else {
                var _loop3 = function(i3) {
                    var n = value[i3];
                    if (n !== $65e201d365740f11$exports.HOLE) stack.push([
                        n,
                        function(v) {
                            array[i3] = v;
                        }
                    ]);
                };
                var array = [];
                hydrated[_$index] = array;
                for(var i3 = 0; i3 < value.length; i3++)_loop3(i3);
                set(array);
                return "continue";
            }
        } else {
            var object = {};
            hydrated[_$index] = object;
            var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
            try {
                var _loop4 = function() {
                    var key = _step1.value;
                    var r = [];
                    stack.push([
                        value[key],
                        function(v) {
                            r[1] = v;
                        }
                    ]);
                    stack.push([
                        Number(key.slice(1)),
                        function(k) {
                            r[0] = k;
                        }
                    ]);
                    postRun.push(function() {
                        object[r[0]] = r[1];
                    });
                };
                for(var _iterator1 = Object.keys(value).reverse()[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true)_loop4();
            } catch (err) {
                _didIteratorError1 = true;
                _iteratorError1 = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                        _iterator1.return();
                    }
                } finally{
                    if (_didIteratorError1) {
                        throw _iteratorError1;
                    }
                }
            }
            set(object);
            return "continue";
        }
    };
    var _this = this, hydrated = _this.hydrated, values = _this.values, deferred = _this.deferred, plugins = _this.plugins;
    var result;
    var stack = [
        [
            index,
            function(v) {
                result = v;
            }
        ]
    ];
    var postRun = [];
    while(stack.length > 0)_loop();
    while(postRun.length > 0)postRun.pop()();
    return result;
}



function $8038ee37bf9c868b$var$decode(readable, options) {
    return $8038ee37bf9c868b$var$_decode.apply(this, arguments);
}
function $8038ee37bf9c868b$var$_decode() {
    $8038ee37bf9c868b$var$_decode = (0, $d1e9370853ff8484$export$71511d61b312f219)(function(readable, options) {
        var plugins, done, reader, decoder, decoded, donePromise;
        return (0, $3d92a16ff8bdcfc3$export$67ebef60e6f28a6)(this, function(_state) {
            switch(_state.label){
                case 0:
                    plugins = (options !== null && options !== void 0 ? options : {}).plugins;
                    done = new $65e201d365740f11$exports.Deferred();
                    reader = readable.pipeThrough((0, $65e201d365740f11$exports.createLineSplittingTransform)()).getReader();
                    decoder = {
                        values: [],
                        hydrated: [],
                        deferred: {},
                        plugins: plugins
                    };
                    return [
                        4,
                        $8038ee37bf9c868b$var$decodeInitial.call(decoder, reader)
                    ];
                case 1:
                    decoded = _state.sent();
                    donePromise = done.promise;
                    if (decoded.done) done.resolve();
                    else donePromise = $8038ee37bf9c868b$var$decodeDeferred.call(decoder, reader).then(done.resolve).catch(function(reason) {
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = Object.values(decoder.deferred)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var deferred = _step.value;
                                deferred.reject(reason);
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                        done.reject(reason);
                    });
                    return [
                        2,
                        {
                            done: donePromise.then(function() {
                                return reader.closed;
                            }),
                            value: decoded.value
                        }
                    ];
            }
        });
    });
    return $8038ee37bf9c868b$var$_decode.apply(this, arguments);
}
$8038ee37bf9c868b$exports.decode = $8038ee37bf9c868b$var$decode;
function $8038ee37bf9c868b$var$decodeInitial(reader) {
    return $8038ee37bf9c868b$var$_decodeInitial.apply(this, arguments);
}
function $8038ee37bf9c868b$var$_decodeInitial() {
    $8038ee37bf9c868b$var$_decodeInitial = (0, $d1e9370853ff8484$export$71511d61b312f219)(function(reader) {
        var read, line;
        return (0, $3d92a16ff8bdcfc3$export$67ebef60e6f28a6)(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        reader.read()
                    ];
                case 1:
                    read = _state.sent();
                    if (!read.value) throw new SyntaxError();
                    try {
                        line = JSON.parse(read.value);
                    } catch (reason) {
                        throw new SyntaxError();
                    }
                    return [
                        2,
                        {
                            done: read.done,
                            value: $6aafc7ae685fcf56$exports.unflatten.call(this, line)
                        }
                    ];
            }
        });
    });
    return $8038ee37bf9c868b$var$_decodeInitial.apply(this, arguments);
}
function $8038ee37bf9c868b$var$decodeDeferred(reader) {
    return $8038ee37bf9c868b$var$_decodeDeferred.apply(this, arguments);
}
function $8038ee37bf9c868b$var$_decodeDeferred() {
    $8038ee37bf9c868b$var$_decodeDeferred = (0, $d1e9370853ff8484$export$71511d61b312f219)(function(reader) {
        var read, line, colonIndex, deferredId, deferred, lineData, jsonLine, value, colonIndex1, deferredId1, deferred1, lineData1, jsonLine1, value1;
        return (0, $3d92a16ff8bdcfc3$export$67ebef60e6f28a6)(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        reader.read()
                    ];
                case 1:
                    read = _state.sent();
                    _state.label = 2;
                case 2:
                    if (!!read.done) return [
                        3,
                        4
                    ];
                    if (!read.value) return [
                        3,
                        2
                    ];
                    line = read.value;
                    switch(line[0]){
                        case $65e201d365740f11$exports.TYPE_PROMISE:
                            {
                                colonIndex = line.indexOf(":");
                                deferredId = Number(line.slice(1, colonIndex));
                                deferred = this.deferred[deferredId];
                                if (!deferred) throw new Error("Deferred ID ".concat(deferredId, " not found in stream"));
                                lineData = line.slice(colonIndex + 1);
                                jsonLine = void 0;
                                try {
                                    jsonLine = JSON.parse(lineData);
                                } catch (reason) {
                                    throw new SyntaxError();
                                }
                                value = $6aafc7ae685fcf56$exports.unflatten.call(this, jsonLine);
                                deferred.resolve(value);
                                break;
                            }
                        case $65e201d365740f11$exports.TYPE_ERROR:
                            {
                                colonIndex1 = line.indexOf(":");
                                deferredId1 = Number(line.slice(1, colonIndex1));
                                deferred1 = this.deferred[deferredId1];
                                if (!deferred1) throw new Error("Deferred ID ".concat(deferredId1, " not found in stream"));
                                lineData1 = line.slice(colonIndex1 + 1);
                                jsonLine1 = void 0;
                                try {
                                    jsonLine1 = JSON.parse(lineData1);
                                } catch (reason) {
                                    throw new SyntaxError();
                                }
                                value1 = $6aafc7ae685fcf56$exports.unflatten.call(this, jsonLine1);
                                deferred1.reject(value1);
                                break;
                            }
                        default:
                            throw new SyntaxError();
                    }
                    return [
                        4,
                        reader.read()
                    ];
                case 3:
                    read = _state.sent();
                    return [
                        3,
                        2
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    });
    return $8038ee37bf9c868b$var$_decodeDeferred.apply(this, arguments);
}
function $8038ee37bf9c868b$var$encode(input, options) {
    var _ref = options !== null && options !== void 0 ? options : {}, plugins = _ref.plugins, postPlugins = _ref.postPlugins, signal = _ref.signal;
    var encoder = {
        deferred: {},
        index: 0,
        indices: new Map(),
        stringified: [],
        plugins: plugins,
        postPlugins: postPlugins,
        signal: signal
    };
    var textEncoder = new TextEncoder();
    var lastSentIndex = 0;
    var readable = new ReadableStream({
        start: function(controller) {
            return (0, $d1e9370853ff8484$export$71511d61b312f219)(function() {
                var id, seenPromises, raceDone, racePromise, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;
                return (0, $3d92a16ff8bdcfc3$export$67ebef60e6f28a6)(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            id = $cb2299d6261abd9c$exports.flatten.call(encoder, input);
                            if (Array.isArray(id)) throw new Error("This should never happen");
                            if (id < 0) controller.enqueue(textEncoder.encode("".concat(id, "\n")));
                            else {
                                controller.enqueue(textEncoder.encode("[".concat(encoder.stringified.join(","), "]\n")));
                                lastSentIndex = encoder.stringified.length - 1;
                            }
                            seenPromises = new WeakSet();
                            if (!Object.keys(encoder.deferred).length) return [
                                3,
                                4
                            ];
                            racePromise = new Promise(function(resolve, reject) {
                                raceDone = resolve;
                                if (signal) {
                                    var rejectPromise = function() {
                                        return reject(signal.reason || new Error("Signal was aborted."));
                                    };
                                    if (signal.aborted) rejectPromise();
                                    else signal.addEventListener("abort", function(event) {
                                        rejectPromise();
                                    });
                                }
                            });
                            _state.label = 1;
                        case 1:
                            if (!(Object.keys(encoder.deferred).length > 0)) return [
                                3,
                                3
                            ];
                            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            try {
                                _loop = function() {
                                    var _step_value = (0, $e3406d20bd91f5ca$export$71511d61b312f219)(_step.value, 2), deferredId = _step_value[0], deferred = _step_value[1];
                                    if (seenPromises.has(deferred)) return "continue";
                                    seenPromises.add(// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
                                    encoder.deferred[Number(deferredId)] = Promise.race([
                                        racePromise,
                                        deferred
                                    ]).then(function(resolved) {
                                        var id = $cb2299d6261abd9c$exports.flatten.call(encoder, resolved);
                                        if (Array.isArray(id)) {
                                            controller.enqueue(textEncoder.encode("".concat($65e201d365740f11$exports.TYPE_PROMISE).concat(deferredId, ':[["').concat($65e201d365740f11$exports.TYPE_PREVIOUS_RESOLVED, '",').concat(id[0], "]]\n")));
                                            encoder.index++;
                                            lastSentIndex++;
                                        } else if (id < 0) controller.enqueue(textEncoder.encode("".concat($65e201d365740f11$exports.TYPE_PROMISE).concat(deferredId, ":").concat(id, "\n")));
                                        else {
                                            var values = encoder.stringified.slice(lastSentIndex + 1).join(",");
                                            controller.enqueue(textEncoder.encode("".concat($65e201d365740f11$exports.TYPE_PROMISE).concat(deferredId, ":[").concat(values, "]\n")));
                                            lastSentIndex = encoder.stringified.length - 1;
                                        }
                                    }, function(reason) {
                                        if (!reason || (typeof reason === "undefined" ? "undefined" : (0, $bddf2f8f9387a36f$export$71511d61b312f219)(reason)) !== "object" || !(reason instanceof Error)) reason = new Error("An unknown error occurred");
                                        var id = $cb2299d6261abd9c$exports.flatten.call(encoder, reason);
                                        if (Array.isArray(id)) {
                                            controller.enqueue(textEncoder.encode("".concat($65e201d365740f11$exports.TYPE_ERROR).concat(deferredId, ':[["').concat($65e201d365740f11$exports.TYPE_PREVIOUS_RESOLVED, '",').concat(id[0], "]]\n")));
                                            encoder.index++;
                                            lastSentIndex++;
                                        } else if (id < 0) controller.enqueue(textEncoder.encode("".concat($65e201d365740f11$exports.TYPE_ERROR).concat(deferredId, ":").concat(id, "\n")));
                                        else {
                                            var values = encoder.stringified.slice(lastSentIndex + 1).join(",");
                                            controller.enqueue(textEncoder.encode("".concat($65e201d365740f11$exports.TYPE_ERROR).concat(deferredId, ":[").concat(values, "]\n")));
                                            lastSentIndex = encoder.stringified.length - 1;
                                        }
                                    }).finally(function() {
                                        delete encoder.deferred[Number(deferredId)];
                                    }));
                                };
                                for(_iterator = Object.entries(encoder.deferred)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                            return [
                                4,
                                Promise.race(Object.values(encoder.deferred))
                            ];
                        case 2:
                            _state.sent();
                            return [
                                3,
                                1
                            ];
                        case 3:
                            raceDone();
                            _state.label = 4;
                        case 4:
                            return [
                                4,
                                Promise.all(Object.values(encoder.deferred))
                            ];
                        case 5:
                            _state.sent();
                            controller.close();
                            return [
                                2
                            ];
                    }
                });
            })();
        }
    });
    return readable;
}
$8038ee37bf9c868b$exports.encode = $8038ee37bf9c868b$var$encode;


window.oc = window.oc || {};
window.oc._decode = (0, $8038ee37bf9c868b$exports.decode);

})();
//# sourceMappingURL=turbostream.js.map
