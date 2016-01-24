/**
 * Created by laixiangran on 2016/1/24
 * 主页：http://www.cnblogs.com/laixiangran/
 * for String
 */

(function(undefined) {

    var com = window.COM = window.COM || {};

    com.$S = {
        camelize: function(s) {
            return s.replace(/-([a-z])/ig, function(all, letter) {
                return letter.toUpperCase();
            });
        },
        trim: function(str) {
            return str.replace(/^\s+|\s+$/g, "");
        },
        rgbToHex: function(str) {

            // 十六进制颜色值的正则表达式
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            if (/^(rgb|RGB)/.test(str)) {
                var aColor = str.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
                var strHex = "#";
                for (var i= 0, len = aColor.length; i < len; i++) {
                    var hex = Number(aColor[i]).toString(16);
                    if (hex === "0") {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if (strHex.length !== 7) {
                    strHex = str;
                }
                return strHex;
            } else if (reg.test(str)) {
                var aNum = str.replace(/#/,"").split("");
                if (aNum.length === 6) {
                    return str;
                } else if (aNum.length === 3) {
                    var numHex = "#";
                    for (var j= 0, l = aNum.length; j < l; j++) {
                        numHex += (aNum[j] + aNum[j]);
                    }
                    return numHex;
                }
            } else {
                return str;
            }
        },
        hexToRgb: function(str) {

            // 十六进制颜色值的正则表达式
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            var sColor = str.toLowerCase();
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    var sColorNew = "#";
                    for (var i = 1; i < 4; i++) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }

                // 处理六位的颜色值
                var sColorChange = [];
                for (var j = 1; j < 7; j += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(j, j + 2)));
                }
                return "RGB(" + sColorChange.join(",") + ")";
            } else {
                return sColor;
            }
        }
    };
}());