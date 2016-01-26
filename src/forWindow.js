/**
 * Created by laixiangran on 2016/1/24
 * 主页：http://www.cnblogs.com/laixiangran/
 * for Window
 */
(function() {

    var com = window.COM = window.COM || {};

    com.$W = {

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

        /**
         * 在window.onload前执行，相当于jq的ready()
         * 使用domReady.ready()将执行函数加入队列中
         **/
        domReady: (function() {

            // 用于添加要执行的函数
            var domReady = function() {
                var fnArr = Array.prototype.slice.call(arguments);

                // 页面如果加载完毕则直接运行
                if (domReady.isReady) {
                    fnArr.forEach(function(fn) {
                        fn();
                    });
                }
                else {
                    domReady.fns = fnArr;
                }
            };

            // 用于判定页面是否加载完毕
            domReady.isReady = false;

            domReady.fns = [];

            // 执行所有在window.onload之前放入的函数
            domReady.fireReady = function() {
                if (!domReady.isReady) {
                    if (!document.body) {
                        return setTimeout(domReady.fireReady, 16);
                    }
                    domReady.isReady = true;
                    if (domReady.fns.length) {
                        domReady.fns.forEach(function(fn) {
                            fn();
                        });
                    }
                }
            };

            // 开始初始化domReady函数，判定页面的加载情况
            if (document.readyState === "complete") {
                domReady.fireReady();
            } else if (-[1,]) {
                document.addEventListener("DOMContentLoaded", function() {
                    document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                    domReady.fireReady();
                }, false);
            } else {

                // 当页面包含图片时，onreadystatechange事件会触发在window.onload之后，
                // 换言之，它只能正确地执行于页面不包含二进制资源或非常少或者被缓存时
                document.attachEvent("onreadystatechange", function() {
                    if (document.readyState == "complete") {
                        document.detachEvent("onreadystatechange", arguments.callee);
                        domReady.fireReady();
                    }
                });
                (function(){
                    if (domReady.isReady) {
                        return;
                    }

                    // doScroll存在于所有标签而不管其是否支持滚动条
                    // 这里如果用document.documentElement.doScroll()，我们需要判定其是否位于顶层document
                    var node = new Image();
                    try {
                        node.doScroll();
                        node = null; // 防止IE内存泄漏
                    }catch (e) {

                        // javascrpt最短时钟间隔为16ms，这里取其倍数
                        setTimeout(arguments.callee, 64);
                        return;
                    }
                    domReady.fireReady();
                })();
            }
            return domReady;
        }()),

        /**
         * requestAnimationFrame兼容性扩展，两方面工作：
         * 1、把各浏览器前缀进行统一
         * 2、在浏览器没有requestAnimationFrame方法时将其指向setTimeout方法
         * */
        requestAnimationFrame: (function() {
            var func = null;
            var lastTime = 0;
            var vendors = ["webkit", "moz"];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                func = window[vendors[x] + "RequestAnimationFrame"];
            }
            if (!func) {
                func = function(callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                    var id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
            return func;
        }()),

        // 取消AnimationFrame
        cancelAnimationFrame: (function() {
            var func = null;
            var vendors = ["webkit", "moz"];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {

                // Webkit中此取消方法的名字变了
                window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
            }
            if (!func) {
                func = function(id) {
                    window.clearTimeout(id);
                };
            }
            return func;
        }())
    };
}());