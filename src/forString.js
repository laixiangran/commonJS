/**
 * Created by laixiangran@163.com on 2016/1/24
 * homepage：http://www.laixiangran.cn
 * for String
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""); //索引表

    com.$S = {
        /**
         * @author laixiangran@163.com
         * @description 将二进制序列转换为Base64编码
         * @param  {String} bitStr
         * @return {String}
         */
        binToBase64: function(bitStr) {
            var result = "";
            var tail = bitStr.length % 6;
            var bitStringTemp1 = bitStr.substr(0, bitStr.length - tail);
            var bitStringTemp2 = bitStr.substr(bitStr.length - tail, tail);
            for (var i = 0, len = bitStringTemp1.length; i < len; i += 6) {
                var index = parseInt(bitStringTemp1.substr(i, 6), 2);
                result += code[index];
            }
            bitStringTemp2 += new Array(7 - tail).join("0");
            if (tail) {
                result += code[parseInt(bitStringTemp2, 2)];
                result += new Array((6 - tail) / 2 + 1).join("=");
            }
            return result;
        },

        /**
         * @author laixiangran@163.com
         * @description 将base64编码转换为二进制序列
         * @param  {String} base64Str
         * @return {String}
         */
        base64ToBin: function(base64Str) {
            var bitString = "";
            var tail = 0;
            for (var i = 0, len = base64Str.length; i < len; i++) {
                if (base64Str[i] != "=") {
                    var decode = code.indexOf(base64Str[i]).toString(2);
                    bitString += (new Array(7 - decode.length)).join("0") + decode;
                } else {
                    tail++;
                }
            }
            return bitString.substr(0, bitString.length - tail * 2);
        },

        /**
         * @author laixiangran@163.com
         * @description 将字符转换为二进制序列
         * @param  {String} str
         * @return {String}
         */
        strToBin: function(str) {
            var result = "";
            for (var i = 0, len = str.length; i < len; i++) {
                var charCode = str.charCodeAt(i).toString(2);
                result += (new Array(9 - charCode.length).join("0") + charCode);
            }
            return result;
        },

        /**
         * @author laixiangran@163.com
         * @description 将二进制序列转换为字符串
         * @param {String} bitStr
         * @return {String}
         */
        binToStr: function BinToStr(bitStr) {
            var result = "";
            for (var i = 0, len = bitStr.length; i < len; i += 8) {
                result += String.fromCharCode(parseInt(bitStr.substr(i, 8), 2));
            }
            return result;
        },

        /**
         * @author laixiangran@163.com
         * @description 将字符串转换为base64编码
         * @param {String} str
         * @return {String}
         */
        strToBase64: function(str) {
            return this.binToBase64(this.strToBin(str));
        },

        /**
         * @author laixiangran@163.com
         * @description 将base64编码转换为字符串
         * @param {String} base64Str
         * @return {String}
         */
        base64ToStr: function(base64Str) {
            return this.binToStr(this.base64ToBin(base64Str));
        },

        /**
         * @author laixiangran@163.com
         * @description 将图片（图片url）转换为base64编码
         * @param {String} url
         * @param {Function} callback 回调函数
         * @return {String}
         */
        imgToBase64: function(url, callback) {
            var image = new Image();
            image.crossOrigin = ''; // 引用其他服务器下的图片，只支持chrome 和 firefox
            image.src = url;
            image.onload = function() {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0);
                var ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();
                var base64 = canvas.toDataURL("image/" + ext);
                callback(base64);
                canvas = null;
            };
        },

        /**
         * @author laixiangran@163.com
         * @description 将字符串中"-"后的小写字符进行大写，如：camelize("background-color") 输出为"backgroundColor
         * @param {String} str
         * @return {String}
         */
        camelize: function(str) {
            return str.replace(/-([a-z])/ig, function(all, letter) {
                return letter.toUpperCase();
            });
        },

        /**
         * @author laixiangran@163.com
         * @description 去掉字符串首尾空格
         * @param {String} str
         * @return {String}
         */
        trim: function(str) {
            return str.replace(/^\s+|\s+$/g, "");
        },

        /**
         * @author laixiangran@163.com
         * @description RGB转十六进制
         * @param {String} str
         * @return {String}
         */
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

        /**
         * @author laixiangran@163.com
         * @description 十六进制转RGB
         * @param {String} str
         * @return {String}
         */
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
}(window));