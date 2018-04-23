/**
 * Created by laixiangran@163.com on 2016/1/24
 * homepage：http://www.laixiangran.cn
 * for Array
 */

(function (window, undefined) {

    var com = window.COM = window.COM || {};

    com.$A = (function () {
        var ret = {
            /**
             * @author laixiangran@163.com
             * @description 判断是否为数组
             * @param {Object} obj
             * @return {Boolean}
             */
            isArray: function (obj) {
                if (Array.isArray) {
                    return Array.isArray(obj);
                } else {
                    return Object.prototype.toString.call(obj) === "[object Array]";
                }
            },

            /**
             * @author laixiangran@163.com
             * @description 从指定位置（未指定则从数组开头）查找项在数组的位置
             * @param {Array} array 数组
             * @param {Object} item 查找项
             * @param {Number} from 开始查找的位置
             * @return {Number}
             */
            indexOf: function (array, item, from) {
                if (array.indexOf) {
                    return isNaN(from) ? array.indexOf(item) : array.indexOf(item, from);
                } else {
                    var len = array.length;
                    from = isNaN(from) ? 0 :
                        from < 0 ? Math.ceil(from) + len : Math.floor(from);
                    for (; from < len; from++) {
                        if (array[from] === item) {
                            return from;
                        }
                    }
                    return -1;
                }
            },

            /**
             * @author laixiangran@163.com
             * @description 从指定位置（未指定则从数组末尾）查找项在数组的位置
             * @param {Array} array 数组
             * @param {Object} item 查找项
             * @param {Number} from 开始查找的位置
             * @return {Number}
             */
            lastIndexOf: function (array, item, from) {
                if (array.lastIndexOf) {
                    return isNaN(from) ? array.lastIndexOf(item) : array.lastIndexOf(item, from);
                } else {
                    var len = array.length;
                    from = isNaN(from) || from >= len - 1 ? len - 1 :
                        from < 0 ? Math.ceil(from) + len : Math.floor(from);
                    for (; from > -1; from--) {
                        if (array[from] === item) {
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

            /**
             * @author laixiangran@163.com
             * @description 对数组中的每一项都执行给定函数，该函数没有返回值
             * @param {Array,Object} object
             * @param {Function} callback
             * @param {Object} thisp
             */
            forEach: function (object, callback, thisp) {
                each(object, function () {
                    callback.apply(thisp, arguments);
                });
            },

            /**
             * @author laixiangran@163.com
             * @description 对数组中的每一项都执行给定函数，返回该函数返回值组成的数组
             * @param {Array,Object} object
             * @param {Function} callback
             * @param {Object} thisp
             * @return {Array}
             */
            map: function (object, callback, thisp) {
                var arr = [];
                each(object, function () {
                    arr.push(callback.apply(thisp, arguments));
                });
                return arr;
            },

            /**
             * @author laixiangran@163.com
             * @description 对数组中的每一项都执行给定函数，返回该函数会返回true的项组成的数组
             * @param {Array,Object} object
             * @param {Function} callback
             * @param {Object} thisp
             * @return {Array}
             */
            filter: function (object, callback, thisp) {
                var arr = [];
                each(object, function (item) {
                    callback.apply(thisp, arguments) && arr.push(item);
                });
                return arr;
            },

            /**
             * @author laixiangran@163.com
             * @description 对数组中的每一项都执行给定函数，如果该函数对每一项都返回true，则返回true
             * @param {Array,Object} object
             * @param {Function} callback
             * @param {Object} thisp
             * @return {Boolean}
             */
            every: function (object, callback, thisp) {
                var flag = true;
                each(object, function () {
                    if (!callback.apply(thisp, arguments)) {
                        flag = false;
                        return false;
                    }
                });
                return flag;
            },

            /**
             * @author laixiangran@163.com
             * @description 对数组中的每一项都执行给定函数，如果该函数对任一项都返回true，则返回true
             * @param {Array,Object} object
             * @param {Function} callback
             * @param {Object} thisp
             * @return {Boolean}
             */
            some: function (object, callback, thisp) {
                var flag = false;
                each(object, function () {
                    if (callback.apply(thisp, arguments)) {
                        flag = true;
                        return false;
                    }
                });
                return flag;
            }
        }, function (method, name) {
            ret[name] = function (object, callback, thisp) {
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
