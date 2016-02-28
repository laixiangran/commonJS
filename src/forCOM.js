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
                return changeVal - commonJS.tween.Bounce.easeOut(duration-currTime, 0, changeVal, duration) + beginVal;
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
                    return commonJS.tween.Bounce.easeIn(currTime * 2, 0, changeVal, duration) * .5 + beginVal;
                } else {
                    return commonJS.tween.Bounce.easeOut(currTime * 2 - duration, 0, changeVal, duration) * .5 + changeVal * .5 + beginVal;
                }
            }
        }
    };

}(window));