/**
 * Created by laixiangran@163.com on 2016/1/24
 * homepage：http://www.laixiangran.cn
 * for Object
 */

(function (window, undefined) {

    var com = window.COM = window.COM || {};

    com.$O = {
        /**
         * @author laixiangran@163.com
         * @description 空函数
         */
        noop: function () {},

        /**
         * @author laixiangran@163.com
         * @description 扩展对象
         * @param {Object} target 扩展对象
         * @param {Object} source 原始对象
         * @param {Boolean} isOverride 是否覆盖相同属性的值
         * @return {Object}
         */
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

        /**
         * @author laixiangran@163.com
         * @description 深度扩展对象，不能用在严格模式下
         * @param {Object} target 扩展对象
         * @param {Object} source 原始对象
         * @return {Object}
         */
        deepextend: function (target, source) {
            for (var p in source) {
                if (source.hasOwnProperty(p)) {
                    var copy = source[p];
                    if (target === copy) {
                        continue;
                    }
                    if (typeof copy === "object") {
                        target[p] = arguments.callee(target[p] || {}, copy);
                    } else {
                        target[p] = copy;
                    }
                }
            }
            return target;
        },

        /**
         * @author laixiangran@163.com
         * @description 包装对象
         * @param {Object} self 子对象
         * @param {Object} parent 继承对象
         * @return {Object}
         */
        wrapper: function (self, parent) {
            var ins = function () {
                self.apply(this, arguments);
            };
            var subclass = function () {};
            subclass.prototype = parent.prototype;
            ins.prototype = new subclass;
            return ins;
        }
    };
}(window));