/**
 * Created by laixiangran on 2016/1/24
 * homepage：http://www.cnblogs.com/laixiangran/
 * for DOM
 */

(function(undefined) {

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

        // 根据标签名查找
        byTagName: function(tagName, context) {
            var ctx = context || document;
            return ctx.getElementsByTagName(tagName);
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
         * @param element 拖拽的元素
         * @param callback 拖拽结束之后的回调函数
         * */
        drag: function(element, callback) {
            callback = callback || function() {};
            var $D = this;
            var params = {
                left: 0,
                top: 0,
                currentX: 0,
                currentY: 0,
                flag: false
            };
            if ($D.getStyle(element, "left") !== "auto") {
                params.left = $D.getStyle(element, "left");
            }
            if ($D.getStyle(element, "top") !== "auto") {
                params.top = $D.getStyle(element, "top");
            }
            element.onmousedown = function(event) {
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
                    element.style.left = parseInt(params.left) + disX + "px";
                    element.style.top = parseInt(params.top) + disY + "px";
                }
            };
            document.onmouseup = function() {
                params.flag = false;
                if ($D.getStyle(element, "left") !== "auto") {
                    params.left = $D.getStyle(element, "left");
                }
                if ($D.getStyle(element, "top") !== "auto") {
                    params.top = $D.getStyle(element, "top");
                }
                callback(element);
            };
        },

        // 获取元素被窗口卷去的上部分高度
        getScrollTop: function(node) {
            var doc = node ? node.ownerDocument : document;
            return doc.documentElement.scrollTop || doc.body.scrollTop;
        },

        // 获取元素被窗口卷去的左部分宽度
        getScrollLeft: function(node) {
            var doc = node ? node.ownerDocument : document;
            return doc.documentElement.scrollLeft || doc.body.scrollLeft;
        },

        /*
        * 元素是否包含某元素
        * @parma nodeA 包含元素
        * @param nodeB 被包含元素
        * */
        contains: document.defaultView ?
            function(nodeA, nodeB) {
                return !!(nodeA.compareDocumentPosition(nodeB) & 16);
            } :
            function(nodeA, nodeB) {
                return nodeA != nodeB && nodeA.contains(nodeB);
            },

        // 获取元素的范围（包括窗口不可见的部分）
        rect: function(node) {
            var left = 0,
                top = 0,
                right = 0,
                bottom = 0;
            // ie8获取不准确
            if (!node.getBoundingClientRect || com.$B.browser.ver == 8) {
                var n = node;
                while (n) {
                    left += n.offsetLeft;
                    top += n.offsetTop;
                    n = n.offsetParent;
                }
                right = left + node.offsetWidth;
                bottom = top + node.offsetHeight;
            } else {
                var rect = node.getBoundingClientRect();
                left = right = this.getScrollLeft(node);
                top = bottom = this.getScrollTop(node);
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
        clientRect: function(node) {
            var rect = this.rect(node),
                sLeft = this.getScrollLeft(node),
                sTop = this.getScrollTop(node);
            rect.left -= sLeft;
            rect.right -= sLeft;
            rect.top -= sTop;
            rect.bottom -= sTop;
            return rect;
        },

        // 获取所有css属性
        curStyle: document.defaultView ?
            function(elem) {
                return document.defaultView.getComputedStyle(elem, null);
            } :
            function(elem) {
                return elem.currentStyle;
            },

        /*
        * 获取元素指定的css属性的值
        * @param elem 当前元素
        * @parma name css属性名
        * */
        getStyle: document.defaultView ?
            function(elem, name) { // 现代浏览器，包括IE9+
                var style = document.defaultView.getComputedStyle(elem, null);
                return name in style ? style[name] : style.getPropertyValue(name);
            } :
            function(elem, name) { // IE8-
                var style = elem.style,
                    curStyle = elem.currentStyle;

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
                    var value = style[name];
                    if (name == "opacity" && com.$B.browser.ie) {
                        elem.style.filter = (elem.currentStyle && elem.currentStyle.filter || "").replace( /alpha\([^)]*\)/, "" ) + " alpha(opacity=" + (value * 100 | 0) + ")";
                    } else if (name == "float") {
                        elem.style[com.$B.browser.ie ? "styleFloat" : "cssFloat" ] = value;
                    } else {
                        elem.style[com.$S.camelize(name)] = value;
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
        }
    };
}());