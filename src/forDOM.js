/**
 * Created by laixiangran@163.com on 2016/1/24
 * homepage：http://www.laixiangran.cn
 * for DOM
 */

(function (window, undefined) {

    var com = window.COM = window.COM || {};

    com.$D = {
        /**
         * @author laixiangran@163.com
         * @description 根据id查找元素
         * @param {String} id 元素id
         * @param {HTMLElement} context 查找的范围元素
         * @return {HTMLElement}
         */
        byId: function (id, context) {
            var ctx = context || document;
            return ctx.getElementById(id);
        },

        /**
         * @author laixiangran@163.com
         * @description 根据类名查找元素
         * @param {String} className 元素类名
         * @param {HTMLElement} context 查找的范围元素
         * @return {HTMLCollection}
         */
        byClassName: function (className, context) {
            var ctx = context || document;
            return ctx.getElementsByClassName(className);
        },

        /**
         * @author laixiangran@163.com
         * @description 根据标签名查找
         * @param {String} tagName 元素名
         * @param {HTMLElement} context 查找的范围元素
         * @return {HTMLCollection}
         */
        byTagName: function (tagName, context) {
            var ctx = context || document;
            return ctx.getElementsByTagName(tagName);
        },

        /**
         * @author laixiangran@163.com
         * @description 元素添加class
         * @param {HTMLElement} element 元素
         * @param {*} className 添加的类，可以单个添加也可多个一起添加
         */
        addClass: function (element, className) {
            if (!com.$A.isArray(className)) {
                className = [className.toString()]
            }
            com.$A.forEach(className, function (c) {
                if (element.classList) {
                    element.classList.add(c);
                } else {
                    var classNames = element.className.split(/\s+/);
                    if (com.$A.indexOf(classNames, c) < 0) {
                        classNames.push(c);
                    }
                    element.className = classNames.join(" ");
                }
            });
        },

        /**
         * @author laixiangran@163.com
         * @description 元素删除class
         * @param {HTMLElement} element 元素
         * @param {*} className 删除的类，可以单个删除也可多个一起删除
         */
        removeClass: function (element, className) {
            if (!com.$A.isArray(className)) {
                className = [className.toString()]
            }
            com.$A.forEach(className, function (c) {
                if (element.classList) {
                    element.classList.remove(c);
                } else {
                    var classNames = element.className.split(/\s+/);
                    var index = com.$A.indexOf(classNames, c);
                    if (index >= 0) {
                        classNames.splice(index, 1);
                    }
                    element.className = classNames.join(" ");
                }
            });
        },

        /**
         * @author laixiangran@163.com
         * @description 获取当前元素的子元素
         * @param {HTMLElement} element 元素
         * @param {Boolean} isSelf 是否返回自身，默认为false
         * @return {String}
         */
        getHtml: function (element, isSelf) {
            isSelf = isSelf || false;
            return isSelf ? element.outerHTML : element.innerHTML;
        },

        /**
         * @author laixiangran@163.com
         * @description 获取当前元素包含的所有文本（包含所有子节点的文本）
         * @param {HTMLElement} element 元素
         * @return {String}
         */
        getText: function (element) {
            return (typeof element.innerText == "string") ? element.innerText : element.textContent;
        },

        /**
         * @author laixiangran@163.com
         * @description 在当前元素插入子元素
         * @param {HTMLElement} element 元素
         * @param {String} elemStr 插入的元素
         * @param {String} type 设置方式，默认"inner"
         * type可取的值：
         * "inner"：在当前元素内插入子元素，之前子元素清空；
         * "outer"：使用新的元素替换当前元素；
         * "beforebegin"：在当前元素之前插入一个紧邻的同辈元素；
         * "afterbegin"：在当前元素之下插入一个新的子元素或在第一个子元素之前再插入新的子元素；
         * "beforeend"：在当前元素之下插入一个新的子元素或在最后一个子元素之后再插入新的子元素；
         * "afterend"：在当前元素之后插入一个紧邻的同辈元素。
         */
        inserHtml: function (element, elemStr, type) {
            if (!type || type == "inner" || type == "outer") {
                type == "outer" ? element.outerHTML = elemStr : element.innerHTML = elemStr;
            } else {
                element.insertAdjacentHTML(type, elemStr);
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 【废弃】 元素插入子节点，建议使用inserHtml方法
         * @param {HTMLElement} parentElem 父元素
         * @param {String,Node} node 插入的节点
         */
        append: function (parentElem, node) {
            if (typeof node == "string") {
                var div = document.createElement("div");
                div.innerHTML = node;
                node = div.childNodes[0];
                parentElem.appendChild(node);
            } else if (node.nodeType) {
                parentElem.appendChild(node);
            }
            return node;
        },

        /**
         * @author laixiangran@163.com
         * @description iframe高度自适应
         * @param {String} id iframe的id
         * @param {Number} endTime 计算的时间
         */
        adjustIframe: function (id, endTime) {
            var iframe = this.byId(id),
                time = 0,
                end = endTime || 30,
                intervalID;
            if (iframe) {
                function callback() {
                    time = time + 1;
                    if (time == end) {
                        clearInterval(intervalID)
                    }
                    var idoc = iframe.contentWindow && iframe.contentWindow.document || iframe.contentDocument;
                    var iheight = Math.max(idoc.body.scrollHeight, idoc.documentElement.scrollHeight);
                    iframe.style.height = iheight + "px";
                }

                intervalID = setInterval(callback, 50)
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 拖拽元素
         * @param {HTMLElement} elem 拖拽的元素
         * @param {Function} callback 拖拽结束之后的回调函数
         */
        drag: function (elem, callback) {
            var _this = this;
            callback = callback || function () {};
            var $D = this;
            var params = {
                left: 0,
                top: 0,
                currentX: 0,
                currentY: 0,
                flag: false
            };
            if ($D.getStyle(elem, "left") !== "auto") {
                params.left = $D.getStyle(elem, "left");
            }
            if ($D.getStyle(elem, "top") !== "auto") {
                params.top = $D.getStyle(elem, "top");
            }
            elem.onmousedown = function (event) {
                params.flag = true;
                event = event || window.event;
                params.currentX = event.clientX;
                params.currentY = event.clientY;
            };
            document.onmousemove = function (event) {
                event = event || window.event;
                if (params.flag) {
                    var nowX = event.clientX,
                        nowY = event.clientY;
                    var disX = nowX - params.currentX,
                        disY = nowY - params.currentY;
                    elem.style.left = parseInt(params.left) + disX + "px";
                    elem.style.top = parseInt(params.top) + disY + "px";
                }
            };
            document.onmouseup = function () {
                params.flag = false;
                if ($D.getStyle(elem, "left") !== "auto") {
                    params.left = _this.getStyle(elem, "left");
                }
                if ($D.getStyle(elem, "top") !== "auto") {
                    params.top = _this.getStyle(elem, "top");
                }
                callback(elem);
            };
        },

        /**
         * @author laixiangran@163.com
         * @description 获取元素被窗口卷去的上部分高度
         * @param {HTMLElement} elem
         * @return {Number}
         */
        getScrollTop: function (elem) {
            var doc = elem ? elem.ownerDocument : document;
            return doc.documentElement.scrollTop || doc.body.scrollTop;
        },

        /**
         * @author laixiangran@163.com
         * @description 获取元素被窗口卷去的左部分宽度
         * @param {HTMLElement} elem
         * @return {Number}
         */
        getScrollLeft: function (elem) {
            var doc = elem ? elem.ownerDocument : document;
            return doc.documentElement.scrollLeft || doc.body.scrollLeft;
        },

        /**
         * @author laixiangran@163.com
         * @description 获取元素的左偏移量
         * @param {HTMLElement} elem
         * @return {Number}
         */
        getElementLeft: function (elem) {
            var actualLeft = elem.offsetLeft;
            var current = elem.offsetParent;
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            return actualLeft;
        },

        /**
         * @author laixiangran@163.com
         * @description 获取元素的上偏移量
         * @param {HTMLElement} elem
         * @return {Number}
         */
        getElementTop: function (elem) {
            var actualTop = elem.offsetTop;
            var current = elem.offsetParent;
            while (current !== null) {
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
            return actualTop;
        },

        /**
         * @author laixiangran@163.com
         * @description 获取元素的范围（包括窗口不可见的部分）
         * @param {HTMLElement} elem
         * @return {Object}
         */
        getRect: function (elem) {
            var left = 0,
                top = 0,
                right = 0,
                bottom = 0;
            if (!elem.getBoundingClientRect) {
                left = this.getElementLeft(elem);
                top = this.getElementTop(elem);
                right = left + elem.offsetWidth;
                bottom = top + elem.offsetHeight;
            } else {
                var rect = elem.getBoundingClientRect();
                left = right = this.getScrollLeft(elem);
                top = bottom = this.getScrollTop(elem);
                left += rect.left;
                right += rect.right;
                top += rect.top;
                bottom += rect.bottom;
            }
            return {
                "left": left,
                "top": top,
                "right": right,
                "bottom": bottom
            };
        },

        /**
         * @author laixiangran@163.com
         * @description 获取元素在窗口可见的范围
         * @param {HTMLElement} elem
         * @return {Object}
         */
        getClientRect: function (elem) {
            var rect = this.getRect(elem),
                sLeft = this.getScrollLeft(elem),
                sTop = this.getScrollTop(elem);
            rect.left -= sLeft;
            rect.right -= sLeft;
            rect.top -= sTop;
            rect.bottom -= sTop;
            return rect;
        },

        /**
         * @author laixiangran@163.com
         * @description 获取浏览器视口大小
         * @return {Object}
         */
        getViewport: function () {
            if (document.compatMode == "BackCompat") { // 判断是否运行在混杂模式
                return {
                    "width": document.body.clientWidth,
                    "height": document.body.clientHeight
                };
            } else {
                return {
                    "width": document.documentElement.clientWidth,
                    "height": document.documentElement.clientHeight
                };
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 元素是否包含某元素
         * @parma {HTMLElement} elemA 包含元素
         * @param {HTMLElement} elemB 被包含元素
         * @return {Boolean}
         */
        contains: function (elemA, elemB) {
            if (typeof elemA.contains === "function" && (!COM.$B.engine.webkit || COM.$B.engine.webkit >= 522)) {
                return elemA.contains(elemB);
            } else if (typeof elemA.compareDocumentPosition === "function") {
                return !!(elemA.compareDocumentPosition(elemB) & 16);
            } else {
                var node = elemB.parentNode;
                do {
                    if (node === elemA) {
                        return true;
                    } else {
                        node = node.parentNode;
                    }
                } while (node !== null);
                return false;
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 获取元素所有css属性
         * @parma {HTMLElement} elem
         * @return {CSSStyleDeclaration}
         */
        getCurStyle: function (elem) {
            if (document.defaultView && typeof document.defaultView.getComputedStyle === "function") {
                return document.defaultView.getComputedStyle(elem, null);
            } else {
                return elem.currentStyle;
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 获取元素指定的css属性的值
         * @param {HTMLElement} elem 当前元素
         * @param {String} name css属性名
         * @return {*}
         */
        getStyle: function (elem, name) {
            var style = null;
            if (document.defaultView && typeof document.defaultView.getComputedStyle === "function") {
                style = document.defaultView.getComputedStyle(elem, null);
                return name in style ? style[name] : style.getPropertyValue(name);
            } else {
                var curStyle = elem.currentStyle;
                style = elem.style;

                if (name === "opacity") {
                    if (/alpha\(opacity=(.*)\)/i.test(curStyle.filter)) {
                        var opacity = parseFloat(RegExp.$1);
                        return opacity ? opacity / 100 : 0;
                    }
                    return 1;
                }
                if (name === "float") {
                    name = "styleFloat";
                }
                var ret = curStyle[name] || curStyle[com.$S.camelize(name)];

                // 单位转换
                if (!/^-?\d+(?:px)?$/i.test(ret) && /^\-?\d/.test(ret)) {
                    var left = style.left,
                        rtStyle = elem.runtimeStyle,
                        rsLeft = rtStyle.left;
                    rtStyle.left = curStyle.left;
                    style.left = ret || 0;
                    ret = style.pixelLeft + "px";
                    style.left = left;
                    rtStyle.left = rsLeft;
                }
                return ret;
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 设置元素指定的css属性的值
         * @param {Array,HTMLElement} elems 设置的元素
         * @parma {String,Object} style css属性名
         * @param {*} value css属性的指（可选）
         */
        setStyle: function (elems, style, value) {
            if (!elems.length) {
                elems = [elems];
            }
            if (typeof style === "string") {
                var s = style;
                style = {};
                style[s] = value;
            }
            com.$A.forEach(elems, function (elem) {
                for (var name in style) {
                    if (style.hasOwnProperty(name)) {
                        var value = style[name];
                        if (name === "opacity" && com.$B.browser.ie) {
                            elem.style.filter = (elem.currentStyle && elem.currentStyle.filter || "").replace(/alpha\([^)]*\)/, "") + " alpha(opacity=" + (value * 100 | 0) + ")";
                        } else if (name === "float") {
                            elem.style[com.$B.browser.ie ? "styleFloat" : "cssFloat"] = value;
                        } else {
                            elem.style[com.$S.camelize(name)] = value;
                        }
                    }
                }
            });
        },

        /**
         * @author laixiangran@163.com
         * @description 获取元素大小
         * @param {HTMLElement} elem
         * @return {Object}
         */
        getSize: function (elem) {
            var width = elem.offsetWidth,
                height = elem.offsetHeight;
            if (!width && !height) {
                var repair = this.contains(document.body, elem),
                    parent;
                if (!repair) { // 元素不在body上
                    parent = elem.parentNode;
                    document.body.insertBefore(elem, document.body.childNodes[0]);
                }
                var style = elem.style,
                    cssShow = {
                        position: "absolute",
                        visibility: "hidden",
                        display: "block",
                        left: "-9999px",
                        top: "-9999px"
                    },
                    cssBack = {
                        position: style.position,
                        visibility: style.visibility,
                        display: style.display,
                        left: style.left,
                        top: style.top
                    };
                this.setStyle(elem, cssShow);
                width = elem.offsetWidth;
                height = elem.offsetHeight;
                this.setStyle(elem, cssBack);
                if (!repair) {
                    parent ? parent.appendChild(elem) : document.body.removeChild(elem);
                }
            }
            return {
                "width": width,
                "height": height
            };
        },

        /**
         * @author laixiangran@163.com
         * @description 选择文本框中的文本
         * @param {HTMLInputElement} textbox 文本框
         * @param {Number} startIndex 开始点
         * @param {Number} stopIndex 结束点
         */
        selectText: function (textbox, startIndex, stopIndex) {
            if (textbox.setSelectionRange) {
                textbox.setSelectionRange(startIndex, stopIndex);
            } else if (textbox.createTextRange) {
                var range = textbox.createTextRange();
                range.collapse(true);
                range.moveStart("character", startIndex);
                range.moveEnd("character", stopIndex - startIndex);
                range.select();
            }
            textbox.focus();
        },

        /**
         * @author laixiangran@163.com
         * @description 获取文本框中选择的文本
         * @param {HTMLInputElement} textbox 文本框
         * @return {String}
         */
        getSelectedText: function (textbox) {
            if (typeof textbox.selectionStart === "number") {
                return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
            } else if (document.selection) {
                // 兼容IE8及更早的版本，document.selection.createRange()保存着用户在整个文档范围内选择的文本信息。
                // 在与select事件一起使用的时候，可以假定是用户选择了文本框中的文本，因而触发了该事件，故可实现获取文本框中选择的文本
                return document.selection.createRange().text;
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 图片灰度化
         * 原理：设置像素点的R、G、B三个分量的值某个灰度值，该灰度值有两种算法：
         * 1、求出每个像素点的R、G、B三个分量的平均值，然后将这个平均值赋予给这个像素的三个分量。
         * 2、（默认使用）根据YUV颜色空间，Y分量的物理意义是点的亮度，由该值反映亮度等级。根据RGB和YUV颜色空间的变化关系可建立亮度Y与R、G、B三个颜色分量的对应：Y = 0.3R+0.59G+0.11B，以这个亮度值表达图像的灰度值。
         * @param {HTMLImageElement} img 图片
         * @param {Boolean} isAvg 是采用平均值算法还是采用YUV与RGB变化关系算法
         * @return {HTMLImageElement}
         */
        removeImageColors: function (img, isAvg) {
            var oCanvas = document.createElement("canvas"),
                oCtx = oCanvas.getContext("2d"),
                nWidth = img.offsetWidth,
                nHeight = img.offsetHeight,
                oImgData = null,
                aPix = null,
                nPixLen = 0,
                nPixel = 0,
                oGrayImg = new Image(),
                ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase(),
                calFunc = null;
            oCanvas.width = nWidth;
            oCanvas.height = nHeight;
            oCtx.drawImage(img, 0, 0);
            oImgData = oCtx.getImageData(0, 0, nWidth, nHeight);
            aPix = oImgData.data;
            nPixLen = aPix.length;

            calFunc = (function () {
                if (isAvg) {
                    return function (r, g, b) {
                        return Math.round((r + g + b) / 3);
                    };
                } else {
                    return function (r, g, b) {
                        return Math.round((0.3 * r + 0.59 * g + 0.11 * b));
                    };
                }
            }());

            for (nPixel = 0; nPixel < nPixLen; nPixel += 4) {
                aPix[nPixel + 2] = aPix[nPixel + 1] = aPix[nPixel] = calFunc(aPix[nPixel], aPix[nPixel + 1], aPix[nPixel + 2]);
            }

            oCtx.putImageData(oImgData, 0, 0);
            oGrayImg.src = oCanvas.toDataURL("image/" + ext);
            oCanvas = null;
            return oGrayImg;
        }
    };
}(window));
