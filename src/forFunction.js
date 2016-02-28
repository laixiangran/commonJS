/**
 * Created by laixiangran on 2016/1/24
 * 主页：http://www.cnblogs.com/laixiangran/
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
            },
            bindAsEventListener: function(fun, thisp) {
                var args = slice.call(arguments, 2);
                return function(event) {
                    return fun.apply(thisp, [window.COM.$E.fixEvent(event)].concat(args));
                }
            }
        };
    }());
}(window));