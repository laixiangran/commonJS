/**
 * Created by laixiangran on 2016/1/24
 * 主页：http://www.cnblogs.com/laixiangran/
 * for Date
 */

(function(undefined) {

    var com = window.COM = window.COM || {};

    com.$DE = {

        // 求当前日期与传入的日期相隔多少天
        getDateInterval: function(date) {
            var d = new Date(date);
            if (d == "Invalid Date") {
                throw "Invalid Date";
            }else {
                // Math.abs 绝对值
                return Math.abs(this*1-d*1)/60/60/1000/24;
            }
        },

        // 求当前日期所在月的第一天
        getFirstDateInMonth: function(date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        },

        // 求当前日期所在月的最后一天
        getLastDateInMonth: function(date) {
            return new Date(date.getFullYear(), date.getMonth()+1, 0);
        },

        // 求当前日期所在季度的第一天
        getFirstDateInQuarter: function(date) {
            return new Date(date.getFullYear(), Math.floor(date.getMonth()/3)*3, 1);
        },

        // 判断是否为闰年
        isLeapYear: function(date) {
            return new Date(date.getFullYear(), 2, 0).getDate() == 29;
        },

        // 求某年某月的天数
        daysInMonth: function(year, month) {
            var d = new Date();
            d.setFullYear(year, (month == 12) ? 1 : month, 0);
            return d.getDate();
        }
    };
}());