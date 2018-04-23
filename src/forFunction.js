/**
 * Created by laixiangran@163.com on 2016/1/24
 * homepage：http://www.laixiangran.cn
 * for Function
 */

(function (window, undefined) {

    var com = window.COM = window.COM || {};

    com.$F = (function () {
        var slice = Array.prototype.slice;
        return {
            /**
             * @author laixiangran@163.com
             * @description 设置函数内的this对象
             * @param {Function} fun 函数
             * @param {Object} thisp 新绑定到this的对象
             * @return {Function}
             */
            bind: function (fun, thisp) {
                var args = slice.call(arguments, 2);
                return function () {
                    return fun.apply(thisp, args.concat(slice.call(arguments)));
                };
            },

            /**
             * @author laixiangran@163.com
             * @description 函数柯里化（function currying 部分求值）。被柯里化的函数带参数时缓存参数，不带参数时开始求值
             * @param {Function} fun 函数
             * @return {Function}
             */
            currying: function (fun) {
                var args = [];
                return function () {
                    if (arguments.length === 0) {
                        return fun.apply(this, args);
                    } else {
                        [].push.apply(args, arguments);
                    }
                };
            },

            /**
             * @author laixiangran@163.com
             * @description 对象借用不属于自己的方法，这是uncurrying的目的
             * @param {Function} fun 函数
             * @return {Function}
             */
            uncurrying: function (fun) {
                return function () {
                    return Function.prototype.call.apply(fun, arguments);
                };
            },

            /**
             * @author laixiangran@163.com
             * @description 函数节流，目的是降低调用函数的频率
             * @param {Function} fun 函数
             * @param {Number} interval 延迟执行的时间
             */
            throttle: function (fun, interval) {
                var _self = fun, // 保存需要被延迟执行的函数引用
                    timer = null, // 定时器
                    firstTime = true; // 是否第一次调用
                return function () {
                    var args = arguments,
                        _me = this;

                    // 第一次执行不需要延迟执行
                    if (firstTime) {
                        _self.apply(_me, args);
                        return firstTime = false;
                    }

                    // 如果定时器还在，说明前一次延迟执行还没有完成
                    if (timer) {
                        return false;
                    }

                    timer = setTimeout(function () {
                        clearTimeout(timer);
                        timer = null;
                        _self.apply(_me, args);
                    }, interval || 500);
                };
            },

            /**
             * @author laixiangran@163.com
             * @description 函数分时，目的是让函数的工作分时进行
             * @param {Array} datas
             * @param {Function} fun 处理数据的函数
             * @param {Number} count 一次处理的数据量
             * @param {Number} interval 每次处理的时间间隔
             */
            timeChunk: function (datas, fun, count, interval) {
                var start = function () {
                    for (var i = 0; i < Math.min(count || 1, datas.length); i++) {
                        var obj = datas.shift();
                        fun(obj);
                    }
                };
                var timer = setInterval(function () {
                    if (datas.length === 0) {
                        clearInterval(timer);
                    }
                    start();
                }, interval || 100);
            },

            /**
             * @author laixiangran@163.com
             * @description 函数AOP（面向切面编程）
             * @param {Function} fun 主函数
             * @param {Function} beforeFun 主函数执行之前的运行程序
             * @param {Function} afterFun 主函数执行之后的运行程序
             */
            aop: function (fun, beforeFun, afterFun) {
                return function () {
                    beforeFun.apply(this, arguments); // 修正this
                    fun.apply(this, arguments);
                    afterFun.apply(this, arguments);
                }
            }
        };
    }());
}(window));
