/**
 * Created by laixiangran@163.com on 2016/1/24
 * homepage：http://www.laixiangran.cn
 * for Number
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$N = {
        /**
         * @author laixiangran@163.com
         * @description 数字保留n位小数，返回数字
         * @param {Number} num 处理的数字
         * @param {Number} n 小数位
         * @return {Number}
         */
        toFixedReturnNumber: function(num, n) {
            return Number(num.toFixed(n));
        },

        /**
         * @author laixiangran@163.com
         * @description 提取数字中的整数部分
         * @param {Number} num 处理的数字
         * @return {Number}
         */
        integer: function(num) {
            // Math.ceil 向上舍入，Math.floor 向下舍入
            return Math[num < 0 ? "ceil" : "floor"](this);
        }
    };
}(window));