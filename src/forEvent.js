/**
 * Created by laixiangran@163.com on 2016/1/24
 * 主页：http://www.laixiangran.cn
 * for Event
 */
(function (window, undefined) {

    var com = window.COM = window.COM || {};

    com.$E = {
        /**
         * @author laixiangran@163.com
         * @description 注册事件
         * @param {Element} element 注册事件的元素
         * @param {String} type 事件类型
         * @param {Function} handler 事件处理程序
         */
        addEvent: function (element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 移除事件处理程序
         * @param {Element} element 注册事件的元素
         * @param {String} type 事件类型
         * @param {Function} handler 事件处理程序
         */
        removeEvent: function (element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent) {
                element.detachEvent("on" + type, handler);
            } else {
                element["on" + type] = null;
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 获取对event对象的引用
         * @param {Event} event 事件对象
         * @return {Event}
         */
        getEvent: function (event) {
            return event ? event : window.event;
        },

        /**
         * @author laixiangran@163.com
         * @description 获取事件的目标
         * @param {Event} event 事件对象
         * @return {Element}
         */
        getTarget: function (event) {
            return event.target || event.srcElement;
        },

        /**
         * @author laixiangran@163.com
         * @description 取消事件的默认行为
         * @param {Event} event 事件对象
         */
        preventDefault: function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false; // IE
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 阻止事件流（阻止事件捕获和冒泡）
         * @param {Event} event 事件对象
         */
        stopPropagation: function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true; // IE
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 获取事件相关元素
         * @param {Event} event 事件对象
         * @return {Element}
         */
        getRelatedTarget: function (event) {
            if (event.relatedTarget) {
                return event.relatedTarget;
            } else if (event.toElement) { // IE下的mouseout事件
                return event.toElement;
            } else if (event.fromElement) { // IE下的mouseover事件
                return event.fromElement;
            } else {
                return null;
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 获取鼠标按钮值（0：主鼠标按钮（一般是鼠标左键），1：中间的鼠标按钮（鼠标滚轮按钮），2：次鼠标按钮（一般是鼠标右键））
         * @param {Event} event 鼠标事件对象
         * @return {Number}
         */
        getButton: function (event) {
            //  检测是否支持DOM版鼠标事件
            if (document.implementation.hasFeature("MouseEvents", "2.0")) {
                return event.button;
            } else { // IE
                switch (event.button) {
                    case 0:
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                        return 0;
                    case 2:
                    case 6:
                        return 2;
                    case 4:
                        return 1;
                }
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 获取鼠标滚轮增量值
         * @param {Event} event 滚轮事件对象
         * @return {Number}
         */
        getWheelDelta: function (event) {
            // 当向前滚动鼠标滚轮时，wheelDelta是120的倍数；当向后滚动鼠标滚轮时，wheelDelta是-120的倍数
            if (event.wheelDelta) {
                // Opera 9.5之前的版本中，wheelDelta值的正负号是颠倒的，则这里需要使用浏览器检测技术来确定实际的值
                return (com.$B.engine.opera && com.$B.engine.opera < 9.5 ?
                    -event.wheelDelta : event.wheelDelta);
            } else { // Firefox下，有关鼠标滚轮的信息则保存在detail属性中，当向前滚动鼠标滚轮时，这个属性的值是-3的倍数，当向后滚动鼠标滚轮时，这个属性的值是3的倍数
                return -event.detail * 40;
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 获取键盘事件中的字符ASCII编码
         * @param {Event} event 键盘事件对象
         * @return {Number}
         */
        getCharCode: function (event) {
            if (typeof event.charCode == "number") {
                return event.charCode;
            } else {
                return event.keyCode; // IE8及之前版本和Opera
            }
        },

        /**
         * @author laixiangran@163.com
         * @description 获取剪贴板内容
         * @param {Event} event 剪切事件对象
         * @return {String}
         */
        getClipboardText: function (event) {
            var clipboardData = (event.clipboardData || window.clipboardData);

            // clipboardData.getData()用于从剪贴板中取得数据，它接受一个参数，即要取得的数据的格式
            // 在IE中，有两种数据格式："text"和"URL"
            // 在Firefox、Safari和Chrome中，这个参数是一种MIME类型；不过，可以用"text"代表"text/plain"
            return clipboardData.getData("text");
        },

        /**
         * @author laixiangran@163.com
         * @description 设置剪切板内容，设置成功返回true
         * @param {Event} event 剪切事件对象
         * @param {String} value 设置的内容
         * @return {Boolean}
         */
        setClipboardText: function (event, value) {
            if (event.clipboardData) {
                // 由于Safari和Chrome的clipboardData.setData()方法不能识别"text"类型，则这里只能写"text/plain"
                return event.clipboardData.setData("text/plain", value);
            } else if (window.clipboardData) {
                return window.clipboardData.setData("text", value);
            }
        }
    }
}(window));