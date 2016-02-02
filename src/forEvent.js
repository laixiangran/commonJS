/**
 * Created by laixiangran on 2016/1/24
 * homepage：http://www.cnblogs.com/laixiangran/
 * for Event
 */
(function(undefined) {

    var com = window.COM = window.COM || {};

    com.$E = (function() {
        var addEvent,
            removeEvent,
            guid = 1,
            storage = function(element, type, handler) {
                if (!handler.$$guid) handler.$$guid = guid++;
                if (!element.events) element.events = {};
                var handlers = element.events[type];
                if (!handlers) {
                    handlers = element.events[type] = {};
                    if (element["on" + type]) {
                        handlers[0] = element["on" + type];
                    }
                }
            };
        if (window.addEventListener) {
            var fix = {
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            };

            /*
             * 注册事件
             * @param element(Element) 绑定事件的元素
             * @param type(String) 事件类型
             * @param handler(Function) 事件处理函数
             * */
            addEvent = function(element, type, handler) {
                if (type in fix) {
                    storage(element, type, handler);
                    var fixhandler = element.events[type][handler.$$guid] = function(event) {
                        var related = event.relatedTarget; // 返回当鼠标移动时哪个元素进入或退出
                        if (!related || (element != related && !(element.compareDocumentPosition(related) && 16))) {
                            handler.call(this, event);
                        }
                    };
                    element.addEventListener(fix[type], fixhandler, false);
                } else {
                    element.addEventListener(type, handler, false);
                }
            };
            /*
             * 取消注册的事件
             * @param element(Element) 绑定事件的元素
             * @param type(String) 事件类型
             * @param handler(Function) 事件处理函数
             * */
            removeEvent = function(element, type, handler) {
                if (type in fix) {
                    if (element.events && element.events[type]) {
                        element.removeEventListener(fix[type], element.events[type][handler.$$guid], false);
                        delete element.events[type][handler.$$guid];
                    }
                } else {
                    element.removeEventListener(type, handler, false);
                }
            };
        } else {
            addEvent = function(element, type, handler) {
                storage(element, type, handler);
                element.events[type][handler.$$guid] = handler;
                element["on" + type] = handleEvent;
            };
            removeEvent = function(element, type, handler) {
                if (element.events && element.events[type]) {
                    delete element.events[type][handler.$$guid];
                }
            };
            function handleEvent() {
                var returnValue = true,
                    event = fixEvent();
                var handlers = this.events[event.type];
                for (var i in handlers) {
                    this.$$handleEvent = handlers[i];
                    if (this.$$handleEvent(event) === false) {
                        returnValue = false;
                    }
                }
                return returnValue;
            }
        }
        function fixEvent(event) {
            if (event) return event;
            event = window.event;
            event.pageX = event.clientX + com.$D.getScrollLeft(event.srcElement);
            event.pageY = event.clientY + com.$D.getScrollTop(event.srcElement);
            event.target = event.srcElement;
            event.stopPropagation = stopPropagation;
            event.preventDefault = preventDefault;
            var relatedTarget = {
                "mouseout": event.toElement,
                "mouseover": event.fromElement
            }[event.type];
            if (relatedTarget) {
                event.relatedTarget = relatedTarget;
            }
            return event;
        }
        function stopPropagation() {
            this.cancelBubble = true;
        }
        function preventDefault() {
            this.returnValue = false;
        }
        return {
            "addEvent": addEvent,
            "removeEvent": removeEvent,
            "fixEvent": fixEvent
        };
    })();
}());