/**
 * Created by laixiangran on 2016/1/24
 * homepage：http://www.cnblogs.com/laixiangran/
 * for DOM
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$D = {
        // 根据id查找
        byId: function(id, context) {
            var ctx = context || document;
            return ctx.getElementById(id);
        },

        // 根据类名查找
        byClassName: function(className, context) {
            var ctx = context || document;
            return ctx.getElementsByClassName(className);
        },

        // 添加class
        addClass: function(element, className) {
            if (!com.$A.isArray(className)) {
                className = [className.toString()]
            }
            com.$A.forEach(className, function(c) {
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

        // 删除class
        removeClass: function(element, className) {
            if (!com.$A.isArray(className)) {
                className = [className.toString()]
            }
            com.$A.forEach(className, function(c) {
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

        // 根据标签名查找
        byTagName: function(tagName, context) {
            var ctx = context || document;
            return ctx.getElementsByTagName(tagName);
        },

        // 添加内容
        append: function(parentElem, node) {
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

        // 在文档中添加样式
        addSheet: function() {
            var doc, cssCode;
            if (arguments.length == 1) {
                doc = document;
                cssCode = arguments[0];
            }else if (arguments.length == 2) {
                doc = arguments[0];
                cssCode = arguments[1];
            }else {
                alert("addSheet函数最多接受两个参数!");
            }
            var headElement = doc.getElementsByTagName("head")[0];
            var styleElements = headElement.getElementsByTagName("style");
            if(styleElements.length == 0){ // 如果不存在style元素则创建
                if (!+"\v1") {    // ie
                    doc.createStyleSheet();
                }else {
                    var tempStyleElement = doc.createElement("style"); //w3c
                    tempStyleElement.setAttribute("type", "text/css");
                    headElement.appendChild(tempStyleElement);
                }
            }
            var  styleElement = styleElements[0];
            var media = styleElement.getAttribute("media");
            if (media != null && !/screen/.test(media.toLowerCase())) {
                styleElement.setAttribute("media", "screen");
            }
            if (!+"\v1") {    // ie
                styleElement.styleSheet.cssText += cssCode;
            }else if (/a/[-1] == "a") {
                styleElement.innerHTML += cssCode; // 火狐支持直接innerHTML添加样式表字串
            }else{
                styleElement.appendChild(doc.createTextNode(cssCode))
            }
        },

        /*
         * iframe高度自适应
         * @param id iframe的id
         * @param endTime 计算的时间
         * */
        adjustIframe: function(id, endTime) {
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

        /*
         * 拖拽元素
         * @param elem 拖拽的元素
         * @param callback 拖拽结束之后的回调函数
         * */
        drag: function(elem, callback) {
            callback = callback || function() {};
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
            elem.onmousedown = function(event) {
                params.flag = true;
                event = event || window.event;
                params.currentX = event.clientX;
                params.currentY = event.clientY;
            };
            document.onmousemove = function(event) {
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
            document.onmouseup = function() {
                params.flag = false;
                if ($D.getStyle(elem, "left") !== "auto") {
                    params.left = $D.getStyle(elem, "left");
                }
                if ($D.getStyle(elem, "top") !== "auto") {
                    params.top = $D.getStyle(elem, "top");
                }
                callback(elem);
            };
        },

        // 获取元素被窗口卷去的上部分高度
        getScrollTop: function(elem) {
            var doc = elem ? elem.ownerDocument : document;
            return doc.documentElement.scrollTop || doc.body.scrollTop;
        },

        // 获取元素被窗口卷去的左部分宽度
        getScrollLeft: function(elem) {
            var doc = elem ? elem.ownerDocument : document;
            return doc.documentElement.scrollLeft || doc.body.scrollLeft;
        },

        // 获取元素的左偏移量
        getElementLeft: function(elem) {
            var actualLeft = elem.offsetLeft;
            var current = elem.offsetParent;
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            return actualLeft;
        },

        // 获取元素的上偏移量
        getElementTop: function(elem) {
            var actualTop = elem.offsetTop;
            var current = elem.offsetParent;
            while (current !== null) {
                actualTop += current. offsetTop;
                current = current.offsetParent;
            }
            return actualTop;
        },

        // 获取元素的范围（包括窗口不可见的部分）
        getRect: function(elem) {
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

        // 获取元素在窗口可见的范围
        getClientRect: function(elem) {
            var rect = this.getRect(elem),
                sLeft = this.getScrollLeft(elem),
                sTop = this.getScrollTop(elem);
            rect.left -= sLeft;
            rect.right -= sLeft;
            rect.top -= sTop;
            rect.bottom -= sTop;
            return rect;
        },

        // 获取浏览器视口大小
        getViewport: function() {
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

        /*
         * 元素是否包含某元素
         * @parma elemA 包含元素
         * @param elemB 被包含元素
         * */
        contains: function(elemA, elemB) {
            if (typeof elemA.contains == "function" && (!COM.$B.engine.webkit || COM.$B.engine.webkit >= 522)) {
                return elemA.contains(elemB);
            } else if (typeof elemA.compareDocumentPosition == "function") {
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

        // 获取所有css属性
        getCurStyle: function(elem) {
            if (document.defaultView && typeof document.defaultView.getComputedStyle == "function") {
                return document.defaultView.getComputedStyle(elem, null);
            } else {
                return elem.currentStyle;
            }
        },

        /*
        * 获取元素指定的css属性的值
        * @param elem 当前元素
        * @parma name css属性名
        * */
        getStyle: function(elem, name) {
            var style = null;
            if (document.defaultView && typeof document.defaultView.getComputedStyle == "function") {
                style = document.defaultView.getComputedStyle(elem, null);
                return name in style ? style[name] : style.getPropertyValue(name);
            } else {
                var curStyle = elem.currentStyle;
                style = elem.style;

                if (name == "opacity") {
                    if (/alpha\(opacity=(.*)\)/i.test(curStyle.filter)) {
                        var opacity = parseFloat(RegExp.$1);
                        return opacity ? opacity / 100 : 0;
                    }
                    return 1;
                }
                if (name == "float") {
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

        /*
         * 设置元素指定的css属性的值
         * @param elem 当前元素
         * @parma style css属性名
         * @param value css属性的指
         * */
        setStyle: function(elems, style, value) {
            if (!elems.length) {
                elems = [elems];
            }
            if (typeof style == "string") {
                var s = style;
                style = {};
                style[s] = value;
            }
            com.$A.forEach(elems, function(elem) {
                for (var name in style) {
                    if (style.hasOwnProperty(name)) {
                        var value = style[name];
                        if (name == "opacity" && com.$B.browser.ie) {
                            elem.style.filter = (elem.currentStyle && elem.currentStyle.filter || "").replace( /alpha\([^)]*\)/, "" ) + " alpha(opacity=" + (value * 100 | 0) + ")";
                        } else if (name == "float") {
                            elem.style[com.$B.browser.ie ? "styleFloat" : "cssFloat" ] = value;
                        } else {
                            elem.style[com.$S.camelize(name)] = value;
                        }
                    }
                }
            });
        },

        // 获取元素大小
        getSize: function(elem) {
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

        // 选择文本框中的文本
        selectText: function(textbox, startIndex, stopIndex) {
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

        // 获取文本框中选择的文本
        getSelectedText: function(textbox) {
            if (typeof textbox.selectionStart == "number") {
                return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
            } else if (document.selection) {
                // 兼容IE8及更早的版本，document.selection.createRange()保存着用户在整个文档范围内选择的文本信息。
                // 在与select事件一起使用的时候，可以假定是用户选择了文本框中的文本，因而触发了该事件，故可实现获取文本框中选择的文本
                return document.selection.createRange().text;
            }
        }
    };
}(window));