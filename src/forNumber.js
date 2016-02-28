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