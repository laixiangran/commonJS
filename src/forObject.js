/**
 * Created by laixiangran on 2016/1/24
 * 主页：http://www.cnblogs.com/laixiangran/
 * for Object
 */

(function(undefined) {

    var com = window.COM = window.COM || {};

    com.$O = {
        noop: function() {},
        extend: function (target, source, isOverride) {
            if (isOverride === undefined) {
                isOverride = true;
            }
            for (var p in source) {
                if (isOverride || !(p in target)) {
                    target[p] = source[p];
                }
            }
            return target;
        },
        deepextend: function(target, source) {
            for (var p in source) {
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
            return target;
        },
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
}());