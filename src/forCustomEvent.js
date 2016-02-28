/**
 * Created by laixiangran on 2016/1/24
 * homepage: http://www.cnblogs.com/laixiangran/
 * for CustomEvent
 */

(function(window, undefined) {

    var com = window.COM = window.COM || {};

    com.$CE = (function() {
        var guid = 1;
        return {
            /*
            * 注册事件
            * @param object(Object) 绑定事件的对象
            * @param type(String) 事件类型
            * @param handler(Function) 事件处理函数
            * */
            addEvent: function(object, type, handler) {
                if (!handler.$$$guid) handler.$$$guid = guid++;
                if (!object.cusevents) object.cusevents = {};
                if (!object.cusevents[type]) object.cusevents[type] = {};
                object.cusevents[type][handler.$$$guid] = handler;
            },
            /*
             * 取消注册的事件
             * @param object(Object) 绑定事件的对象
             * @param type(String) 事件类型
             * @param handler(Function) 事件处理函数
             * */
            removeEvent: function(object, type, handler) {
                if (object.cusevents && object.cusevents[type]) {
                    delete object.cusevents[type][handler.$$$guid];
                }
            },
            /*
             * 触发事件
             * @param object(Object) 绑定事件的对象
             * @param type(String) 事件类型
             * */
            fireEvent: function(object, type) {
                if (!object.cusevents) return;
                var args = Array.prototype.slice.call(arguments, 2),
                    handlers = object.cusevents[type];
                for (var i in handlers) {
                    if (handlers.hasOwnProperty(i)) {
                        handlers[i].apply(object, args);
                    }
                }
            },
            /*
             * 清除所有绑定的事件
             * @param object(Object) 绑定事件的对象
             * */
            clearEvent: function(object) {
                if (!object.cusevents) return;
                for (var type in object.cusevents) {
                    if (object.cusevents.hasOwnProperty(type)) {
                        var handlers = object.cusevents[type];
                        for (var i in handlers) {
                            if (handlers.hasOwnProperty(i)) {
                                handlers[i] = null;
                            }
                        }
                        object.cusevents[type] = null;
                    }
                }
                object.cusevents = null;
            }
        };
    }());
}(window));