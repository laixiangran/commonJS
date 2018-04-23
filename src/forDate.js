/**
 * Created by laixiangran@163.com on 2016/1/24
 * homepage：http://www.laixiangran.cn
 * for Date
 */

(function (window, undefined) {

    var com = window.COM = window.COM || {};

    com.$DE = {

        /**
         * @author laixiangran@163.com
         * @description 求当前日期与传入的日期相隔多少天
         * @param {Date} date 当前日期
         * @return {Number}
         */
        getDateInterval: function (date) {
            var d = new Date(date);
            if (d === "Invalid Date") {
                throw "Invalid Date";
            } else {
                // Math.abs 绝对值
                return Math.abs(this * 1 - d * 1) / 60 / 60 / 1000 / 24;
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 求当前日期所在月的第一天
         * @param {Date} date 当前日期
         * @return {Date}
         */
        getFirstDateInMonth: function (date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        },

        /**
         * @author laixiangran@163.com
         * @description 求当前日期所在月的最后一天
         * @param {Date} date 当前日期
         * @return {Date}
         */
        getLastDateInMonth: function (date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0);
        },

        /**
         * @author laixiangran@163.com
         * @description 求当前日期所在季度的第一天
         * @param {Date} date 当前日期
         * @return {Date}
         */
        getFirstDateInQuarter: function (date) {
            return new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
        },

        /**
         * @author laixiangran@163.com
         * @description 判断是否为闰年
         * @param {Date} date 当前日期
         * @return {Date}
         */
        isLeapYear: function (date) {
            return new Date(date.getFullYear(), 2, 0).getDate() === 29;
        },

        /**
         * @author laixiangran@163.com
         * @description 求某年某月的天数
         * @param {Number} year 年
         * @param {Number} month 月
         * @return {Number}
         */
        daysInMonth: function (year, month) {
            var d = new Date();
            d.setFullYear(year, (month === 12) ? 1 : month, 0);
            return d.getDate();
        }
    };
}(window));
