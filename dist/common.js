/**
 * Created by laixiangran on 2016/1/24
 * homepage：http://www.cnblogs.com/laixiangran/
 * for Array
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$A = (function() {
        var ret = {
            isArray: function(obj) {
                if (Array.isArray) {
                    return Array.isArray(obj);
                } else {
                    return Object.prototype.toString.call(obj) === "[object Array]";
                }
            },
            indexOf: function(array, item, from) {
                if (array.indexOf) {
                    return isNaN(from) ? array.indexOf(item) : array.indexOf(item, from);
                } else {
                    var len = array.length;
                    from = isNaN(from) ? 0 :
                        from < 0 ? Math.ceil(from) + len : Math.floor(from);
                    for (; from < len; from++ ) {
                        if ( array[from] === item ) {
                            return from;
                        }
                    }
                    return -1;
                }
            },
            lastIndexOf: function(array, item, from) {
                if (array.lastIndexOf) {
                    return isNaN(from) ? array.lastIndexOf(item) : array.lastIndexOf(item, from);
                } else {
                    var len = array.length;
                    from = isNaN(from) || from >= len - 1 ? len - 1 :
                        from < 0 ? Math.ceil(from) + len : Math.floor(from);
                    for (; from > -1; from-- ) {
                        if ( array[from] === item ) {
                            return from;
                        }
                    }
                    return -1;
                }
            }
        };

        function each(object, callback) {
            if (undefined === object.length) {
                for (var name in object) {
                    if (object.hasOwnProperty(name)) {
                        if (false === callback(object[name], name, object)) {
                            break;
                        }
                    }
                }
            } else {
                for (var i = 0, len = object.length; i < len; i++) {
                    if (i in object) {
                        if (false === callback(object[i], i, object)) {
                            break;
                        }
                    }
                }
            }
        }

        each({
            forEach: function(object, callback, thisp) {
                each(object, function() {
                    callback.apply(thisp, arguments);
                });
            },
            map: function(object, callback, thisp) {
                var arr = [];
                each(object, function() {
                    arr.push(callback.apply(thisp, arguments));
                });
                return arr;
            },
            filter: function(object, callback, thisp) {
                var arr = [];
                each(object, function(item) {
                    callback.apply(thisp, arguments) && arr.push(item);
                });
                return arr;
            },
            every: function(object, callback, thisp) {
                var flag = true;
                each(object, function() {
                    if (!callback.apply(thisp, arguments)) {
                        flag = false;
                        return false;
                    }
                });
                return flag;
            },
            some: function(object, callback, thisp) {
                var flag = false;
                each(object, function() {
                    if (callback.apply(thisp, arguments)) {
                        flag = true;
                        return false;
                    }
                });
                return flag;
            }
        }, function(method, name) {
            ret[name] = function(object, callback, thisp) {
                if (object[name]) {
                    return object[name](callback, thisp);
                } else {
                    return method(object, callback, thisp);
                }
            }
        });

        return ret;
    }());
}(window));

/**
 * Created by laixiangran on 2016/1/24
 * homepage：http://www.cnblogs.com/laixiangran/
 * for Browser
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    var $B = com.$B = (function() {
        // 呈现引擎信息
        var engine = {

            // 呈现引擎
            ie: 0,
            gecko: 0,
            webkit: 0,
            khtml: 0,
            opera:0,

            //具体版本号
            ver: null
        };

        var browser = {

            // 浏览器
            ie: 0,
            edge: 0,
            firefox: 0,
            safari: 0,
            konq: 0,
            opera: 0,
            chrome: 0,

            // 具体版本号
            ver: null
        };

        // 平台、设备和操作系统
        var system = {
            win: false,
            mac: false,
            unix: false,

            // 移动设备
            iphone: false,
            ipod: false,
            ipad: false,
            ios: false,
            android: false,
            nokiaN: false,
            winMobile: false,

            // 游戏系统
            wii: false, // 任天堂
            ps: false   // Playstation3
        };

        // 获取浏览器的用户代理字符串
        var ua = window.navigator.userAgent;

        // 检测呈现引擎和浏览器
        // 检测Presto内核的Opera浏览器
        if(window.opera){
            engine.ver = browser.ver = window.opera.version();
            engine.opera = browser.opera = parseFloat(engine.ver);
        }

        // 检测WebKit 用代理字符串中的"AppleWebKit"进行检测
        else if(/AppleWebKit\/(\S+)/.test(ua)){
            engine.ver = RegExp["$1"];
            engine.webkit = parseFloat(engine.ver);

            //确定 Microsoft Edge
            if(/Edge\/(\S+)/.test(ua)){
                browser.ver = RegExp["$1"];
                browser.edge = parseFloat(browser.ver);
            }

            // 确定WebKit内核Opera
            else if(/OPR\/(\S+)/.test(ua)){
                browser.ver = RegExp["$1"];
                browser.opera = parseFloat(browser.ver);
            }

            // 确定Chrome
            else if(/Chrome\/(\S+)/.test(ua)){
                browser.ver = RegExp["$1"];
                browser.chrome = parseFloat(browser.ver);
            }

            // 确定Safari
            else if(/Version\/(\S+)/.test(ua)){
                browser.ver = RegExp["$1"];
                browser.safari = parseFloat(browser.ver);
            }else{

                // 近似的确定版本号
                var safariVersion = 1;
                if(engine.webkit < 100){
                    safariVersion = 1;
                }else if(engine.webkit <312){
                    safariVersion = 1.2;
                }else if(engine.webkit < 412){
                    safariVersion = 1.3;
                }else{
                    safariVersion = 2;
                }
                browser.ver = browser.safari = safariVersion;
            }
        }

        // 检测KHTML 用于Konqueror3.1及更早版本中不包含KHTML的版本，故而就要使用Konqueror的版本来代替
        else if(/KHTML\/(\S+)/.test(ua) || /Konqueror\/(\S+)/.test(ua)){
            engine.ver = browser.ver = RegExp["$1"];
            engine.khtml = browser.konq = parseFloat(engine.ver);
        }

        // 检测Gecko 其版本号在字符串"rv:"的后面
        else if(/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){
            engine.ver = RegExp["$1"];
            engine.gecko = parseFloat(engine.ver);

            // 确定Firefox
            if(/Firefox\/(\S+)/.test(ua)){
                browser.ver = RegExp["$1"];
                browser.firefox = parseFloat(browser.ver);
            }
        }

        // 检测IE
        else if(/MSIE ([^;]+)/.test(ua) || /rv:([^\)]+)\) like Gecko/.test(ua)){
            engine.ver = browser.ver = RegExp["$1"];
            engine.ie = browser.ie = parseFloat(engine.ver);
        }

        // 获取平台或者操作系统信息,可能的值：win32、win64、MacPPC、MacIntel、Xll、Linux i686
        var p = window.navigator.platform;

        // 检测平台
        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.unix = (p == "Xll'") || (p.indexOf("Linux") == 0);

        // 检测Windows操作系统
        if(system.win){
            if(/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
                if(RegExp["$1"] == "NT"){
                    switch(RegExp["$2"]){
                        case "5.0":
                            system.win = "2000";
                            break;
                        case "5.1":
                            system.win = "XP";
                            break;
                        case "6.0":
                            system.win = "Vista";
                            break;
                        case "7":
                            system.win = "7";
                            break;
                        case "8":
                            system.win = "8";
                            break;
                        case "8.1":
                            system.win = "8.1";
                            break;
                        case "10.0":
                            system.win = "10.0";
                            break;
                        default:
                            system.win = "NT";
                            break;
                    }
                }
            }
        }

        // 移动设备
        system.iphone = ua.indexOf("iPhone") > -1;
        system.ipod = ua.indexOf("iPod") > -1;
        system.ipad = ua.indexOf("iPad") > -1;
        system.nokiaN = ua.indexOf("NokiaN") > -1;

        // window mobile
        if(system.win == "CE"){
            system.winMobile = system.win;
        }else if(system.win == "Ph"){
            if(/Windows Phone OS (\d+.\d+)/.test(ua)){
                system.win = "Phone";
                system.winMobile = parseFloat(RegExp["$1"]);
            }
        }

        // 检测iOS版本
        if(system.mac && ua.indexOf("Mobile") > -1){
            if(/CPU (?:iPhone )?OS (\d+.\d+)/.test(ua)){
                system.ios = parseFloat(RegExp["$1"].replace("_","."));
            }else{
                system.ios = 2; //不能真正检测出来，所以只能猜测
            }
        }

        // 检测安卓版本
        if(/Android (\d+.\d+)/.test(ua)){
            system.android = parseFloat(RegExp["$1"]);
        }

        // 检测游戏系统
        system.wii = ua.indexOf("wii") > -1;
        system.ps = /playstation/i.test(ua);

        if (browser.ver == 6) {
            try {
                document.execCommand("BackgroundImageCache", false, true);
            } catch(e) {}
        }

        return {
            "engine": engine,
            "browser": browser,
            "system": system
        };
    }());
}(window));
/**
 * Created by laixiangran on 2016/1/25.
 * homepage: http://www.cnblogs.com/laixiangran/
 * for COM（命名空间）
 */
(function(window, undefined) {

    var com = window.COM = window.COM || {};

    /*
    * 产生唯一ID
    * */
    com.buildGuid = function() {
        function guid() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (guid()+guid()+"-"+guid()+"-"+guid()+"-"+guid()+"-"+guid()+guid()+guid());
    };

    /*
    * 取得数据的类型（一个参数时）或判定数据的类型(两个参数时)
    * @param obj 数据
    * @param str 用于判断的数据类型
    * */
    com.getOrIsType = (function() {
        var reg = /^(\w)/,
            regFn = function($, $1) {
                return $1.toUpperCase();
            },
            to_s = Object.prototype.toString;
        return function(obj, str) {
            var result = (typeof obj).replace(reg, regFn);
            if (result === "Object" || (result === "Function" && obj.exec) ){ // safari chrome中 type /i/ 为function
                if (obj === null) {
                    result = "Null";
                }
                else if (obj.window == obj) { // 返回Window的构造器名字
                    result = "Window";
                }
                else if (obj.callee) { // 类数组的参数组
                    result = "Arguments";
                }
                else if (obj.nodeType === 9) {
                    result = "Document";
                }
                else if (obj.nodeName) { // 处理元素节点
                    result = (obj.nodeName + "").replace("#", "");
                }
                else if (!obj.constructor || !(obj instanceof Object)) {
                    if("send" in obj && "setRequestHeader" in obj){//处理IE5-8的宿主对象与节点集合
                        result = "XMLHttpRequest"
                    }else if("length" in obj && "item" in obj){
                        result = "namedItem" in obj ? "HTMLCollection" : "NodeList";
                    }else{
                        result = "Unknown";
                    }
                }else {
                    result = to_s.call(obj).slice(8,-1);
                }
            }
            if (result === "Number" && isNaN(obj))  {
                result = "NaN";
            }

            // safari chrome中 对 HTMLCollection与NodeList的to_s都为 "NodeList",此bug暂时无解
            if (str) {
                return str === result;
            }
            return result;
        };
    })();

    /**
     * Tween介绍：
     * Linear：无缓动效果
     * Quadratic：二次方的缓动（t^2）
     * Cubic：三次方的缓动（t^3）
     * Quartic：四次方的缓动（t^4）
     * Quintic：五次方的缓动（t^5）
     * Sinusoidal：正弦曲线的缓动（sin(t)）
     * Exponential：指数曲线的缓动（2^t）
     * Circular：圆形曲线的缓动（sqrt(1-t^2)）
     * Elastic：指数衰减的正弦曲线缓动
     * Back：超过范围的三次方缓动（(s+1)*t^3 – s*t^2）
     * Bounce：指数衰减的反弹缓动
     * 每个效果都分三个缓动方式，分别是（可采用后面的邪恶记忆法帮助记忆）：
     * easeIn：从0开始加速的缓动；
     * easeOut：减速到0的缓动；
     * easeInOut：前半段从0开始加速，后半段减速到0的缓动。
     *
     * @param currTime: current time（当前时间）
     * @param beginVal: beginning value（初始值）
     * @param changeVal: change in value（变化量）
     * @param duration: duration（持续时间）
     */
    com.tween = {
        "Linear": function(currTime, beginVal, changeVal, duration) {
            return changeVal*currTime/duration + beginVal;
        },
        "Quad": {
            easeIn: function(currTime, beginVal, changeVal, duration) {
                return changeVal * (currTime /= duration) * currTime + beginVal;
            },
            easeOut: function(currTime, beginVal, changeVal, duration) {
                return -changeVal *(currTime /= duration)*(currTime-2) + beginVal;
            },
            easeInOut: function(currTime, beginVal, changeVal, duration) {
                if ((currTime /= duration / 2) < 1) return changeVal / 2 * currTime * currTime + beginVal;
                return -changeVal / 2 * ((--currTime) * (currTime-2) - 1) + beginVal;
            }
        },
        "Cubic": {
            easeIn: function(currTime, beginVal, changeVal, duration) {
                return changeVal * (currTime /= duration) * currTime * currTime + beginVal;
            },
            easeOut: function(currTime, beginVal, changeVal, duration) {
                return changeVal * ((currTime = currTime/duration - 1) * currTime * currTime + 1) + beginVal;
            },
            easeInOut: function(currTime, beginVal, changeVal, duration) {
                if ((currTime /= duration / 2) < 1) return changeVal / 2 * currTime * currTime*currTime + beginVal;
                return changeVal / 2*((currTime -= 2) * currTime * currTime + 2) + beginVal;
            }
        },
        "Quart": {
            easeIn: function(currTime, beginVal, changeVal, duration) {
                return changeVal * (currTime /= duration) * currTime * currTime*currTime + beginVal;
            },
            easeOut: function(currTime, beginVal, changeVal, duration) {
                return -changeVal * ((currTime = currTime/duration - 1) * currTime * currTime*currTime - 1) + beginVal;
            },
            easeInOut: function(currTime, beginVal, changeVal, duration) {
                if ((currTime /= duration / 2) < 1) return changeVal / 2 * currTime * currTime * currTime * currTime + beginVal;
                return -changeVal / 2 * ((currTime -= 2) * currTime * currTime*currTime - 2) + beginVal;
            }
        },
        "Quint": {
            easeIn: function(currTime, beginVal, changeVal, duration) {
                return changeVal * (currTime /= duration) * currTime * currTime * currTime * currTime + beginVal;
            },
            easeOut: function(currTime, beginVal, changeVal, duration) {
                return changeVal * ((currTime = currTime/duration - 1) * currTime * currTime * currTime * currTime + 1) + beginVal;
            },
            easeInOut: function(currTime, beginVal, changeVal, duration) {
                if ((currTime /= duration / 2) < 1) return changeVal / 2 * currTime * currTime * currTime * currTime * currTime + beginVal;
                return changeVal / 2*((currTime -= 2) * currTime * currTime * currTime * currTime + 2) + beginVal;
            }
        },
        "Sine": {
            easeIn: function(currTime, beginVal, changeVal, duration) {
                return -changeVal * Math.cos(currTime/duration * (Math.PI/2)) + changeVal + beginVal;
            },
            easeOut: function(currTime, beginVal, changeVal, duration) {
                return changeVal * Math.sin(currTime/duration * (Math.PI/2)) + beginVal;
            },
            easeInOut: function(currTime, beginVal, changeVal, duration) {
                return -changeVal / 2 * (Math.cos(Math.PI * currTime/duration) - 1) + beginVal;
            }
        },
        "Expo": {
            easeIn: function(currTime, beginVal, changeVal, duration) {
                return (currTime==0) ? beginVal : changeVal * Math.pow(2, 10 * (currTime/duration - 1)) + beginVal;
            },
            easeOut: function(currTime, beginVal, changeVal, duration) {
                return (currTime==duration) ? beginVal + changeVal : changeVal * (-Math.pow(2, -10 * currTime/duration) + 1) + beginVal;
            },
            easeInOut: function(currTime, beginVal, changeVal, duration) {
                if (currTime==0) return beginVal;
                if (currTime==duration) return beginVal+changeVal;
                if ((currTime /= duration / 2) < 1) return changeVal / 2 * Math.pow(2, 10 * (currTime - 1)) + beginVal;
                return changeVal / 2 * (-Math.pow(2, -10 * --currTime) + 2) + beginVal;
            }
        },
        "Circ": {
            easeIn: function(currTime, beginVal, changeVal, duration) {
                return -changeVal * (Math.sqrt(1 - (currTime /= duration) * currTime) - 1) + beginVal;
            },
            easeOut: function(currTime, beginVal, changeVal, duration) {
                return changeVal * Math.sqrt(1 - (currTime = currTime/duration - 1) * currTime) + beginVal;
            },
            easeInOut: function(currTime, beginVal, changeVal, duration) {
                if ((currTime /= duration / 2) < 1) return -changeVal / 2 * (Math.sqrt(1 - currTime * currTime) - 1) + beginVal;
                return changeVal / 2 * (Math.sqrt(1 - (currTime -= 2) * currTime) + 1) + beginVal;
            }
        },
        "Elastic": {
            easeIn: function(currTime, beginVal, changeVal, duration, a, p) {
                var s;
                if (currTime==0) return beginVal;
                if ((currTime /= duration) == 1) return beginVal + changeVal;
                if (typeof p == "undefined") p = duration * .3;
                if (!a || a < Math.abs(changeVal)) {
                    s = p / 4;
                    a = changeVal;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(changeVal / a);
                }
                return -(a * Math.pow(2, 10 * (currTime -= 1)) * Math.sin((currTime * duration - s) * (2 * Math.PI) / p)) + beginVal;
            },
            easeOut: function(currTime, beginVal, changeVal, duration, a, p) {
                var s;
                if (currTime==0) return beginVal;
                if ((currTime /= duration) == 1) return beginVal + changeVal;
                if (typeof p == "undefined") p = duration * .3;
                if (!a || a < Math.abs(changeVal)) {
                    a = changeVal;
                    s = p / 4;
                } else {
                    s = p/(2*Math.PI) * Math.asin(changeVal/a);
                }
                return (a * Math.pow(2, -10 * currTime) * Math.sin((currTime * duration - s) * (2 * Math.PI) / p) + changeVal + beginVal);
            },
            easeInOut: function(currTime, beginVal, changeVal, duration, a, p) {
                var s;
                if (currTime==0) return beginVal;
                if ((currTime /= duration / 2) == 2) return beginVal+changeVal;
                if (typeof p == "undefined") p = duration * (.3 * 1.5);
                if (!a || a < Math.abs(changeVal)) {
                    a = changeVal;
                    s = p / 4;
                } else {
                    s = p / (2  *Math.PI) * Math.asin(changeVal / a);
                }
                if (currTime < 1) return -.5 * (a * Math.pow(2, 10* (currTime -=1 )) * Math.sin((currTime * duration - s) * (2 * Math.PI) / p)) + beginVal;
                return a * Math.pow(2, -10 * (currTime -= 1)) * Math.sin((currTime * duration - s) * (2 * Math.PI) / p ) * .5 + changeVal + beginVal;
            }
        },
        "Back": {
            easeIn: function(currTime, beginVal, changeVal, duration, s) {
                if (typeof s == "undefined") s = 1.70158;
                return changeVal * (currTime /= duration) * currTime * ((s + 1) * currTime - s) + beginVal;
            },
            easeOut: function(currTime, beginVal, changeVal, duration, s) {
                if (typeof s == "undefined") s = 1.70158;
                return changeVal * ((currTime = currTime/duration - 1) * currTime * ((s + 1) * currTime + s) + 1) + beginVal;
            },
            easeInOut: function(currTime, beginVal, changeVal, duration, s) {
                if (typeof s == "undefined") s = 1.70158;
                if ((currTime /= duration / 2) < 1) return changeVal / 2 * (currTime * currTime * (((s *= (1.525)) + 1) * currTime - s)) + beginVal;
                return changeVal / 2*((currTime -= 2) * currTime * (((s *= (1.525)) + 1) * currTime + s) + 2) + beginVal;
            }
        },
        "Bounce": {
            easeIn: function(currTime, beginVal, changeVal, duration) {
                return changeVal - com.Bounce.easeOut(duration-currTime, 0, changeVal, duration) + beginVal;
            },
            easeOut: function(currTime, beginVal, changeVal, duration) {
                if ((currTime /= duration) < (1 / 2.75)) {
                    return changeVal * (7.5625 * currTime * currTime) + beginVal;
                } else if (currTime < (2 / 2.75)) {
                    return changeVal * (7.5625 * (currTime -= (1.5 / 2.75)) * currTime + .75) + beginVal;
                } else if (currTime < (2.5 / 2.75)) {
                    return changeVal * (7.5625 * (currTime -= (2.25 / 2.75)) * currTime + .9375) + beginVal;
                } else {
                    return changeVal * (7.5625 * (currTime -= (2.625 / 2.75)) * currTime + .984375) + beginVal;
                }
            },
            easeInOut: function(currTime, beginVal, changeVal, duration) {
                if (currTime < duration / 2) {
                    return com.Bounce.easeIn(currTime * 2, 0, changeVal, duration) * .5 + beginVal;
                } else {
                    return com.Bounce.easeOut(currTime * 2 - duration, 0, changeVal, duration) * .5 + changeVal * .5 + beginVal;
                }
            }
        }
    };

}(window));
/**
 * Created by laixiangran on 2016/1/24
 * homepage: http://www.cnblogs.com/laixiangran/
 * for CustomEvent
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$CE = (function() {
        var guid = 1;
        return {
            /*
            * 注册事件
            * @param object(Object) 绑定事件的对象
            * @param type(String) 事件类型
            * @param handler(Function) 事件处理函数
            * */
            addEvent: function(object, type, handler) {
                if (!handler.$$$guid) handler.$$$guid = guid++;
                if (!object.cusevents) object.cusevents = {};
                if (!object.cusevents[type]) object.cusevents[type] = {};
                object.cusevents[type][handler.$$$guid] = handler;
            },
            /*
             * 取消注册的事件
             * @param object(Object) 绑定事件的对象
             * @param type(String) 事件类型
             * @param handler(Function) 事件处理函数
             * */
            removeEvent: function(object, type, handler) {
                if (object.cusevents && object.cusevents[type]) {
                    delete object.cusevents[type][handler.$$$guid];
                }
            },
            /*
             * 触发事件
             * @param object(Object) 绑定事件的对象
             * @param type(String) 事件类型
             * */
            fireEvent: function(object, type) {
                if (!object.cusevents) return;
                var args = Array.prototype.slice.call(arguments, 2),
                    handlers = object.cusevents[type];
                for (var i in handlers) {
                    if (handlers.hasOwnProperty(i)) {
                        handlers[i].apply(object, args);
                    }
                }
            },
            /*
             * 清除所有绑定的事件
             * @param object(Object) 绑定事件的对象
             * */
            clearEvent: function(object) {
                if (!object.cusevents) return;
                for (var type in object.cusevents) {
                    if (object.cusevents.hasOwnProperty(type)) {
                        var handlers = object.cusevents[type];
                        for (var i in handlers) {
                            if (handlers.hasOwnProperty(i)) {
                                handlers[i] = null;
                            }
                        }
                        object.cusevents[type] = null;
                    }
                }
                object.cusevents = null;
            }
        };
    }());
}(window));
/**
 * Created by laixiangran on 2016/1/24
 * homepage：http://www.cnblogs.com/laixiangran/
 * for Date
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$DE = {

        // 求当前日期与传入的日期相隔多少天
        getDateInterval: function(date) {
            var d = new Date(date);
            if (d == "Invalid Date") {
                throw "Invalid Date";
            }else {
                // Math.abs 绝对值
                return Math.abs(this*1-d*1)/60/60/1000/24;
            }
        },

        // 求当前日期所在月的第一天
        getFirstDateInMonth: function(date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        },

        // 求当前日期所在月的最后一天
        getLastDateInMonth: function(date) {
            return new Date(date.getFullYear(), date.getMonth()+1, 0);
        },

        // 求当前日期所在季度的第一天
        getFirstDateInQuarter: function(date) {
            return new Date(date.getFullYear(), Math.floor(date.getMonth()/3)*3, 1);
        },

        // 判断是否为闰年
        isLeapYear: function(date) {
            return new Date(date.getFullYear(), 2, 0).getDate() == 29;
        },

        // 求某年某月的天数
        daysInMonth: function(year, month) {
            var d = new Date();
            d.setFullYear(year, (month == 12) ? 1 : month, 0);
            return d.getDate();
        }
    };
}(window));
/**
 * Created by laixiangran on 2016/1/24
 * homepage：http://www.cnblogs.com/laixiangran/
 * for DOM
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$D = {
        // 根据id查找
        byId: function(id, context) {
            var ctx = context || document;
            return ctx.getElementById(id);
        },

        // 根据类名查找
        byClassName: function(className, context) {
            var ctx = context || document;
            return ctx.getElementsByClassName(className);
        },

        // 根据标签名查找
        byTagName: function(tagName, context) {
            var ctx = context || document;
            return ctx.getElementsByTagName(tagName);
        },

        // 在文档中添加样式
        addSheet: function() {
            var doc, cssCode;
            if (arguments.length == 1) {
                doc = document;
                cssCode = arguments[0];
            }else if (arguments.length == 2) {
                doc = arguments[0];
                cssCode = arguments[1];
            }else {
                alert("addSheet函数最多接受两个参数!");
            }
            var headElement = doc.getElementsByTagName("head")[0];
            var styleElements = headElement.getElementsByTagName("style");
            if(styleElements.length == 0){ // 如果不存在style元素则创建
                if (!+"\v1") {    // ie
                    doc.createStyleSheet();
                }else {
                    var tempStyleElement = doc.createElement("style"); //w3c
                    tempStyleElement.setAttribute("type", "text/css");
                    headElement.appendChild(tempStyleElement);
                }
            }
            var  styleElement = styleElements[0];
            var media = styleElement.getAttribute("media");
            if (media != null && !/screen/.test(media.toLowerCase())) {
                styleElement.setAttribute("media", "screen");
            }
            if (!+"\v1") {    // ie
                styleElement.styleSheet.cssText += cssCode;
            }else if (/a/[-1] == "a") {
                styleElement.innerHTML += cssCode; // 火狐支持直接innerHTML添加样式表字串
            }else{
                styleElement.appendChild(doc.createTextNode(cssCode))
            }
        },

        /*
         * iframe高度自适应
         * @param id iframe的id
         * @param endTime 计算的时间
         * */
        adjustIframe: function(id, endTime) {
            var iframe = this.byId(id),
                time = 0,
                end = endTime || 30,
                intervalID;
            if (iframe) {
                function callback() {
                    time = time + 1;
                    if (time == end) {
                        clearInterval(intervalID)
                    }
                    var idoc = iframe.contentWindow && iframe.contentWindow.document || iframe.contentDocument;
                    var iheight = Math.max(idoc.body.scrollHeight, idoc.documentElement.scrollHeight);
                    iframe.style.height = iheight + "px";
                }
                intervalID = setInterval(callback, 50)
            }
        },

        /*
         * 拖拽元素
         * @param elem 拖拽的元素
         * @param callback 拖拽结束之后的回调函数
         * */
        drag: function(elem, callback) {
            callback = callback || function() {};
            var $D = this;
            var params = {
                left: 0,
                top: 0,
                currentX: 0,
                currentY: 0,
                flag: false
            };
            if ($D.getStyle(elem, "left") !== "auto") {
                params.left = $D.getStyle(elem, "left");
            }
            if ($D.getStyle(elem, "top") !== "auto") {
                params.top = $D.getStyle(elem, "top");
            }
            elem.onmousedown = function(event) {
                params.flag = true;
                event = event || window.event;
                params.currentX = event.clientX;
                params.currentY = event.clientY;
            };
            document.onmousemove = function(event) {
                event = event || window.event;
                if (params.flag) {
                    var nowX = event.clientX,
                        nowY = event.clientY;
                    var disX = nowX - params.currentX,
                        disY = nowY - params.currentY;
                    elem.style.left = parseInt(params.left) + disX + "px";
                    elem.style.top = parseInt(params.top) + disY + "px";
                }
            };
            document.onmouseup = function() {
                params.flag = false;
                if ($D.getStyle(elem, "left") !== "auto") {
                    params.left = $D.getStyle(elem, "left");
                }
                if ($D.getStyle(elem, "top") !== "auto") {
                    params.top = $D.getStyle(elem, "top");
                }
                callback(elem);
            };
        },

        // 获取元素被窗口卷去的上部分高度
        getScrollTop: function(elem) {
            var doc = elem ? elem.ownerDocument : document;
            return doc.documentElement.scrollTop || doc.body.scrollTop;
        },

        // 获取元素被窗口卷去的左部分宽度
        getScrollLeft: function(elem) {
            var doc = elem ? elem.ownerDocument : document;
            return doc.documentElement.scrollLeft || doc.body.scrollLeft;
        },

        // 获取元素的左偏移量
        getElementLeft: function(elem) {
            var actualLeft = elem.offsetLeft;
            var current = elem.offsetParent;
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            return actualLeft;
        },

        // 获取元素的上偏移量
        getElementTop: function(elem) {
            var actualTop = elem.offsetTop;
            var current = elem.offsetParent;
            while (current !== null) {
                actualTop += current. offsetTop;
                current = current.offsetParent;
            }
            return actualTop;
        },

        // 获取元素的范围（包括窗口不可见的部分）
        getRect: function(elem) {
            var left = 0,
                top = 0,
                right = 0,
                bottom = 0;
            if (!elem.getBoundingClientRect) {
                left = this.getElementLeft(elem);
                top = this.getElementTop(elem);
                right = left + elem.offsetWidth;
                bottom = top + elem.offsetHeight;
            } else {
                var rect = elem.getBoundingClientRect();
                left = right = this.getScrollLeft(elem);
                top = bottom = this.getScrollTop(elem);
                left += rect.left;
                right += rect.right;
                top += rect.top;
                bottom += rect.bottom;
            }
            return {
                "left": left,
                "top": top,
                "right": right,
                "bottom": bottom
            };
        },

        // 获取元素在窗口可见的范围
        getClientRect: function(elem) {
            var rect = this.getRect(elem),
                sLeft = this.getScrollLeft(elem),
                sTop = this.getScrollTop(elem);
            rect.left -= sLeft;
            rect.right -= sLeft;
            rect.top -= sTop;
            rect.bottom -= sTop;
            return rect;
        },

        // 获取浏览器视口大小
        getViewport: function() {
            if (document.compatMode == "BackCompat") { // 判断是否运行在混杂模式
                return {
                    "width": document.body.clientWidth,
                    "height": document.body.clientHeight
                };
            } else {
                return {
                    "width": document.documentElement.clientWidth,
                    "height": document.documentElement.clientHeight
                };
            }
        },

        /*
         * 元素是否包含某元素
         * @parma elemA 包含元素
         * @param elemB 被包含元素
         * */
        contains: function(elemA, elemB) {
            if (typeof elemA.contains == "function" && (!COM.$B.engine.webkit || COM.$B.engine.webkit >= 522)) {
                return elemA.contains(elemB);
            } else if (typeof elemA.compareDocumentPosition == "function") {
                return !!(elemA.compareDocumentPosition(elemB) & 16);
            } else {
                var node = elemB.parentNode;
                do {
                    if (node === elemA) {
                        return true;
                    } else {
                        node = node.parentNode;
                    }
                } while (node !== null);
                return false;
            }
        },

        // 获取所有css属性
        getCurStyle: function(elem) {
            if (document.defaultView && typeof document.defaultView.getComputedStyle == "function") {
                return document.defaultView.getComputedStyle(elem, null);
            } else {
                return elem.currentStyle;
            }
        },

        /*
        * 获取元素指定的css属性的值
        * @param elem 当前元素
        * @parma name css属性名
        * */
        getStyle: function(elem, name) {
            var style = null;
            if (document.defaultView && typeof document.defaultView.getComputedStyle == "function") {
                style = document.defaultView.getComputedStyle(elem, null);
                return name in style ? style[name] : style.getPropertyValue(name);
            } else {
                var curStyle = elem.currentStyle;
                style = elem.style;

                if (name == "opacity") {
                    if (/alpha\(opacity=(.*)\)/i.test(curStyle.filter)) {
                        var opacity = parseFloat(RegExp.$1);
                        return opacity ? opacity / 100 : 0;
                    }
                    return 1;
                }
                if (name == "float") {
                    name = "styleFloat";
                }
                var ret = curStyle[name] || curStyle[com.$S.camelize(name)];

                // 单位转换
                if (!/^-?\d+(?:px)?$/i.test(ret) && /^\-?\d/.test(ret)) {
                    var left = style.left,
                        rtStyle = elem.runtimeStyle,
                        rsLeft = rtStyle.left;
                    rtStyle.left = curStyle.left;
                    style.left = ret || 0;
                    ret = style.pixelLeft + "px";
                    style.left = left;
                    rtStyle.left = rsLeft;
                }
                return ret;
            }
        },

        /*
         * 设置元素指定的css属性的值
         * @param elem 当前元素
         * @parma style css属性名
         * @param value css属性的指
         * */
        setStyle: function(elems, style, value) {
            if (!elems.length) {
                elems = [elems];
            }
            if (typeof style == "string") {
                var s = style;
                style = {};
                style[s] = value;
            }
            com.$A.forEach(elems, function(elem) {
                for (var name in style) {
                    if (style.hasOwnProperty(name)) {
                        var value = style[name];
                        if (name == "opacity" && com.$B.browser.ie) {
                            elem.style.filter = (elem.currentStyle && elem.currentStyle.filter || "").replace( /alpha\([^)]*\)/, "" ) + " alpha(opacity=" + (value * 100 | 0) + ")";
                        } else if (name == "float") {
                            elem.style[com.$B.browser.ie ? "styleFloat" : "cssFloat" ] = value;
                        } else {
                            elem.style[com.$S.camelize(name)] = value;
                        }
                    }
                }
            });
        },

        // 获取元素大小
        getSize: function(elem) {
            var width = elem.offsetWidth,
                height = elem.offsetHeight;
            if (!width && !height) {
                var repair = this.contains(document.body, elem),
                    parent;
                if (!repair) { // 元素不在body上
                    parent = elem.parentNode;
                    document.body.insertBefore(elem, document.body.childNodes[0]);
                }
                var style = elem.style,
                    cssShow = {
                        position: "absolute",
                        visibility: "hidden",
                        display: "block",
                        left: "-9999px",
                        top: "-9999px"
                    },
                    cssBack = {
                        position: style.position,
                        visibility: style.visibility,
                        display: style.display,
                        left: style.left,
                        top: style.top
                    };
                this.setStyle(elem, cssShow);
                width = elem.offsetWidth;
                height = elem.offsetHeight;
                this.setStyle(elem, cssBack);
                if (!repair) {
                    parent ? parent.appendChild(elem) : document.body.removeChild(elem);
                }
            }
            return {
                "width": width,
                "height": height
            };
        },

        // 选择文本框中的文本
        selectText: function(textbox, startIndex, stopIndex) {
            if (textbox.setSelectionRange) {
                textbox.setSelectionRange(startIndex, stopIndex);
            } else if (textbox.createTextRange) {
                var range = textbox.createTextRange();
                range.collapse(true);
                range.moveStart("character", startIndex);
                range.moveEnd("character", stopIndex - startIndex);
                range.select();
            }
            textbox.focus();
        },

        // 获取文本框中选择的文本
        getSelectedText: function(textbox) {
            if (typeof textbox.selectionStart == "number") {
                return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
            } else if (document.selection) {
                // 兼容IE8及更早的版本，document.selection.createRange()保存着用户在整个文档范围内选择的文本信息。
                // 在与select事件一起使用的时候，可以假定是用户选择了文本框中的文本，因而触发了该事件，故可实现获取文本框中选择的文本
                return document.selection.createRange().text;
            }
        }
    };
}(window));
/**
 * Created by laixiangran on 2016/1/24
 * 主页：http://www.cnblogs.com/laixiangran/
 * for Event
 */
(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$E = {
        // 添加事件
        addEvent: function(element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        },

        // 移除事件处理程序
        removeEvent: function(element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent) {
                element.detachEvent("on" + type, handler);
            } else {
                element["on" + type] = null;
            }
        },

        // 获取对event对象的引用
        getEvent: function(event) {
            return event ? event : window.event;
        },

        // 获取事件的目标
        getTarget: function(event) {
            return event.target || event.srcElement;
        },

        // 取消事件的默认行为
        preventDefault: function(event) {
            if (event.preventDefault){
                event.preventDefault();
            } else {
                event.returnValue = false; // IE
            }
        },

        // 阻止事件流（由于IE不支持事件捕获，该方法只能阻止事件冒泡）
        stopPropagation: function(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true; // IE
            }
        },

        // 获取事件相关元素
        getRelatedTarget: function(event) {
            if (event.relatedTarget) {
                return event.relatedTarget;
            } else if (event.toElement) { // IE下的mouseout事件
                return event.toElement;
            } else if (event.fromElement) { // IE下的mouseover事件
                return event.fromElement;
            } else {
                return null;
            }
        },

        // 获取鼠标按钮值（0：主鼠标按钮（一般是鼠标左键），1：中间的鼠标按钮（鼠标滚轮按钮），2：次鼠标按钮（一般是鼠标右键））
        getButton: function(event) {
            //  检测是否支持DOM版鼠标事件
            if (document.implementation.hasFeature("MouseEvents", "2.0")) {
                return event.button;
            } else { // IE
                switch (event.button) {
                    case 0:
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                        return 0;
                    case 2:
                    case 6:
                        return 2;
                    case 4:
                        return 1;
                }
            }
        },

        // 获取鼠标滚轮增量值
        getWheelDelta: function(event) {
            // 当向前滚动鼠标滚轮时，wheelDelta是120的倍数；当向后滚动鼠标滚轮时，wheelDelta是-120的倍数
            if (event.wheelDelta){
                // Opera 9.5之前的版本中，wheelDelta值的正负号是颠倒的，则这里需要使用浏览器检测技术来确定实际的值
                return (com.$B.engine.opera && com.$B.engine.opera < 9.5 ?
                        -event.wheelDelta : event.wheelDelta);
            } else { // Firefox下，有关鼠标滚轮的信息则保存在detail属性中，当向前滚动鼠标滚轮时，这个属性的值是-3的倍数，当向后滚动鼠标滚轮时，这个属性的值是3的倍数
                return -event.detail * 40;
            }
        },

        // 获取键盘事件中的字符ASCII编码
        getCharCode: function(event) {
            if (typeof event.charCode == "number") {
                return event.charCode;
            } else {
                return event.keyCode; // IE8及之前版本和Opera
            }
        },

        // 获取剪贴板内容
        getClipboardText: function(event) {
            var clipboardData = (event.clipboardData || window.clipboardData);

            // clipboardData.getData()用于从剪贴板中取得数据，它接受一个参数，即要取得的数据的格式
            // 在IE中，有两种数据格式："text"和"URL"
            // 在Firefox、Safari和Chrome中，这个参数是一种MIME类型；不过，可以用"text"代表"text/plain"
            return clipboardData.getData("text");
        },

        // 设置剪切板内容，设置成功返回true
        setClipboardText: function(event, value) {
            if (event.clipboardData) {
                // 由于Safari和Chrome的clipboardData.setData()方法不能识别"text"类型，则这里只能写"text/plain"
                return event.clipboardData.setData("text/plain", value);
            } else if (window.clipboardData) {
                return window.clipboardData.setData("text", value);
            }
        }
    }
}(window));
/**
 * Created by laixiangran on 2016/1/24
 * homepage：http://www.cnblogs.com/laixiangran/
 * for Function
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$F = (function() {
        var slice = Array.prototype.slice;
        return {
            bind: function(fun, thisp) {
                var args = slice.call(arguments, 2);
                return function() {
                    return fun.apply(thisp, args.concat(slice.call(arguments)));
                }
            }
        };
    }());
}(window));
/**
 * Created by laixiangran on 2016/1/24
 * homepage：http://www.cnblogs.com/laixiangran/
 * for Number
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$N = {
        // 数字保留n位小数，返回数字
        toFixedReturnNumber: function(num, n) {
            return Number(num.toFixed(n));
        },

        // 提取数字中的整数部分
        integer: function(num) {
            // Math.ceil 向上舍入，Math.floor 向下舍入
            return Math[num < 0 ? "ceil" : "floor"](this);
        }
    };
}(window));
/**
 * Created by laixiangran on 2016/1/24
 * homepage：http://www.cnblogs.com/laixiangran/
 * for Object
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$O = {
        // 空函数
        noop: function() {},

        // 扩展对象
        extend: function (target, source, isOverride) {
            if (isOverride === undefined) {
                isOverride = true;
            }
            for (var p in source) {
                if (source.hasOwnProperty(p)) {
                    if (isOverride || !(p in target)) {
                        target[p] = source[p];
                    }
                }
            }
            return target;
        },

        // 深度扩展对象
        deepextend: function(target, source) {
            for (var p in source) {
                if (source.hasOwnProperty(p)) {
                    var copy = source[p];
                    if ( target === copy ) {
                        continue;
                    }
                    if (typeof copy === "object"){
                        target[p] = arguments.callee(target[p] || {}, copy);
                    }else{
                        target[p] = copy;
                    }
                }
            }
            return target;
        },

        // 包装对象
        wrapper: function(self, parent) {
            var ins = function() {
                self.apply(this, arguments);
            };
            var subclass = function() {};
            subclass.prototype = parent.prototype;
            ins.prototype = new subclass;
            return ins;
        }
    };
}(window));
/**
 * Created by laixiangran on 2016/1/24
 * homepage：http://www.cnblogs.com/laixiangran/
 * for String
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$S = {
        // 将字符串中"-"后的小写字符进行大写，如：camelize("background-color") 输出为"backgroundColor"
        camelize: function(str) {
            return str.replace(/-([a-z])/ig, function(all, letter) {
                return letter.toUpperCase();
            });
        },

        // 去掉字符串首尾空格
        trim: function(str) {
            return str.replace(/^\s+|\s+$/g, "");
        },

        // RGB转十六进制
        rgbToHex: function(str) {
            // 十六进制颜色值的正则表达式
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            if (/^(rgb|RGB)/.test(str)) {
                var aColor = str.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
                var strHex = "#";
                for (var i= 0, len = aColor.length; i < len; i++) {
                    var hex = Number(aColor[i]).toString(16);
                    if (hex === "0") {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if (strHex.length !== 7) {
                    strHex = str;
                }
                return strHex;
            } else if (reg.test(str)) {
                var aNum = str.replace(/#/,"").split("");
                if (aNum.length === 6) {
                    return str;
                } else if (aNum.length === 3) {
                    var numHex = "#";
                    for (var j= 0, l = aNum.length; j < l; j++) {
                        numHex += (aNum[j] + aNum[j]);
                    }
                    return numHex;
                }
            } else {
                return str;
            }
        },

        // 十六进制转RGB
        hexToRgb: function(str) {
            // 十六进制颜色值的正则表达式
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            var sColor = str.toLowerCase();
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    var sColorNew = "#";
                    for (var i = 1; i < 4; i++) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }

                // 处理六位的颜色值
                var sColorChange = [];
                for (var j = 1; j < 7; j += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(j, j + 2)));
                }
                return "RGB(" + sColorChange.join(",") + ")";
            } else {
                return sColor;
            }
        }
    };
}(window));
/**
 * Created by laixiangran on 2016/1/24
 * 主页：http://www.cnblogs.com/laixiangran/
 * for Window
 */
(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$W = {

        // 在文档中添加样式
        addSheet: function() {
            var doc, cssCode;
            if (arguments.length == 1) {
                doc = document;
                cssCode = arguments[0];
            }else if (arguments.length == 2) {
                doc = arguments[0];
                cssCode = arguments[1];
            }else {
                alert("addSheet函数最多接受两个参数!");
            }
            var headElement = doc.getElementsByTagName("head")[0];
            var styleElements = headElement.getElementsByTagName("style");
            if(styleElements.length == 0){ // 如果不存在style元素则创建
                if (!+"\v1") {    // IE
                    doc.createStyleSheet();
                }else {
                    var tempStyleElement = doc.createElement("style"); // w3c
                    tempStyleElement.setAttribute("type", "text/css");
                    headElement.appendChild(tempStyleElement);
                }
            }
            var  styleElement = styleElements[0];
            var media = styleElement.getAttribute("media");
            if (media != null && !/screen/.test(media.toLowerCase())) {
                styleElement.setAttribute("media", "screen");
            }
            if (!+"\v1") {    // IE
                styleElement.styleSheet.cssText += cssCode;
            }else if (/a/[-1] == "a") {
                styleElement.innerHTML += cssCode; // firefox支持直接innerHTML添加样式表字串
            }else{
                styleElement.appendChild(doc.createTextNode(cssCode))
            }
        },

        /**
         * 在window.onload前执行，相当于jq的ready()
         * 使用domReady.ready()将执行函数加入队列中
         **/
        domReady: (function() {
            // 用于添加要执行的函数
            var domReady = function() {
                var fnArr = Array.prototype.slice.call(arguments);

                // 页面如果加载完毕则直接运行
                if (domReady.isReady) {
                    fnArr.forEach(function(fn) {
                        fn();
                    });
                }
                else {
                    domReady.fns = fnArr;
                }
            };

            // 用于判定页面是否加载完毕
            domReady.isReady = false;

            domReady.fns = [];

            // 执行所有在window.onload之前放入的函数
            domReady.fireReady = function() {
                if (!domReady.isReady) {
                    if (!document.body) {
                        return setTimeout(domReady.fireReady, 16);
                    }
                    domReady.isReady = true;
                    if (domReady.fns.length) {
                        domReady.fns.forEach(function(fn) {
                            fn();
                        });
                    }
                }
            };

            // 开始初始化domReady函数，判定页面的加载情况
            if (document.readyState == "interactive" || document.readyState == "complete") {
                domReady.fireReady();
            } else if (!com.$B.engine.ie) {
                com.$E.addEvent(document, "DOMContentLoaded", function() {
                    com.$E.removeEvent(document, "DOMContentLoaded", arguments.callee);
                    domReady.fireReady();
                });
            } else {
                // 当页面包含较多或较大的外部资源，readystatechange事件会在load事件触发之前先进入交互阶段，
                // 而在包含较少或较小的外部资源的页面中，则很难说readystatechange事件会发生在load事件前面
                document.attachEvent("onreadystatechange", function() {
                    if (document.readyState == "interactive" || document.readyState == "complete") {
                        document.detachEvent("onreadystatechange", arguments.callee);
                        domReady.fireReady();
                    }
                });
                (function(){
                    if (domReady.isReady) {
                        return;
                    }

                    // doScroll存在于所有标签而不管其是否支持滚动条
                    // 这里如果用document.documentElement.doScroll()，我们需要判定其是否位于顶层document
                    var node = new Image();
                    try {
                        node.doScroll();
                        node = null; // 防止IE内存泄漏
                    }catch (e) {
                        // javascrpt最短时钟间隔为16ms，这里取其倍数
                        setTimeout(arguments.callee, 64);
                        return;
                    }
                    domReady.fireReady();
                })();
            }
            return domReady;
        }()),

        /**
         * requestAnimationFrame兼容性扩展，两方面工作：
         * 1、把各浏览器前缀进行统一
         * 2、在浏览器没有requestAnimationFrame方法时将其指向setTimeout方法
         * */
        requestAnimationFrame: (function() {
            var func = null;
            var lastTime = 0;
            var vendors = ["webkit", "moz"];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                func = window[vendors[x] + "RequestAnimationFrame"];
            }
            if (!func) {
                func = function(callback) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                    var id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
            return func;
        }()),

        // 取消AnimationFrame
        cancelAnimationFrame: (function() {
            var func = null;
            var vendors = ["webkit", "moz"];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {

                // Webkit中此取消方法的名字变了
                window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
            }
            if (!func) {
                func = function(id) {
                    window.clearTimeout(id);
                };
            }
            return func;
        }())
    };
}(window));