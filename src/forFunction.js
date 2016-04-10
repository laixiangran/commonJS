/**
 * Created by laixiangran@163.com on 2016/1/24
 * homepage：http://www.laixiangran.cn
 * for Function
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$F = (function() {
        var slice = Array.prototype.slice;
        return {
            /**
             * @author laixiangran@163.com
             * @description 设置函数内的this对象
             * @param {Function} fun 函数
             * @param {Object} thisp 新绑定到this的对象
             * @return {Function}
             */
            bind: function(fun, thisp) {
                var args = slice.call(arguments, 2);
                return function() {
                    return fun.apply(thisp, args.concat(slice.call(arguments)));
                }
            }
        };
    }());
}(window));