/**
 * Created by laixiangran on 2016/1/24
 * 主页：http://www.cnblogs.com/laixiangran/
 * for Browser
 */

(function(undefined) {

    var com = window.COM = window.COM || {};

    var $B = com.$B = {};

    // 呈现引擎信息
    var engine = {

        // 呈现引擎
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera:0,

        //具体版本号
        ver: null
    };

    var browser = {

        // 浏览器
        ie: 0,
        edge: 0,
        firefox: 0,
        safari: 0,
        konq: 0,
        opera: 0,
        chrome: 0,

        // 具体版本号
        ver: null
    };

    // 平台、设备和操作系统
    var system = {
        win: false,
        mac: false,
        unix: false,

        // 移动设备
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,

        // 游戏系统
        wii: false, // 任天堂
        ps: false   // Playstation3
    };

    // 获取浏览器的用户代理字符串
    var ua = window.navigator.userAgent;

    // 检测呈现引擎和浏览器
    // 检测Presto内核的Opera浏览器
    if(window.opera){
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    }

    // 检测WebKit 用代理字符串中的"AppleWebKit"进行检测
    else if(/AppleWebKit\/(\S+)/.test(ua)){
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);

        //确定 Microsoft Edge
        if(/Edge\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.edge = parseFloat(browser.ver);
        }

        // 确定WebKit内核Opera
        else if(/OPR\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.opera = parseFloat(browser.ver);
        }

        // 确定Chrome
        else if(/Chrome\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);
        }

        // 确定Safari
        else if(/Version\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);
        }else{

            // 近似的确定版本号
            var safariVersion = 1;
            if(engine.webkit < 100){
                safariVersion = 1;
            }else if(engine.webkit <312){
                safariVersion = 1.2;
            }else if(engine.webkit < 412){
                safariVersion = 1.3;
            }else{
                safariVersion = 2;
            }
            browser.ver = browser.safari = safariVersion;
        }
    }

    // 检测KHTML 用于Konqueror3.1及更早版本中不包含KHTML的版本，故而就要使用Konqueror的版本来代替
    else if(/KHTML\/(\S+)/.test(ua) || /Konqueror\/(\S+)/.test(ua)){
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);s
    }

    // 检测Gecko 其版本号在字符串"rv:"的后面
    else if(/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver);

        // 确定Firefox
        if(/Firefox\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
        }
    }

    // 检测IE
    else if(/MSIE ([^;]+)/.test(ua) || /rv:([^\)]+)\) like Gecko/.test(ua)){
        engine.ver = browser.ver = RegExp["$1"];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }

    // 获取平台或者操作系统信息,可能的值：win32、win64、MacPPC、MacIntel、Xll、Linux i686
    var p = window.navigator.platform;

    // 检测平台
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.unix = (p == "Xll'") || (p.indexOf("Linux") == 0);

    // 检测Windows操作系统
    if(system.win){
        if(/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
            if(RegExp["$1"] == "NT"){
                switch(RegExp["$2"]){
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "7":
                        system.win = "7";
                        break;
                    case "8":
                        system.win = "8";
                        break;
                    case "8.1":
                        system.win = "8.1";
                        break;
                    case "10.0":
                        system.win = "10.0";
                        break;
                    default:
                        system.win = "NT";
                        break;
                }
            }
        }
    }

    // 移动设备
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("iPad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;

    // window mobile
    if(system.win == "CE"){
        system.winMobile = system.win;
    }else if(system.win == "Ph"){
        if(/Windows Phone OS (\d+.\d+)/.test(ua)){
            system.win = "Phone";
            system.winMobile = parseFloat(RegExp["$1"]);
        }
    }

    // 检测iOS版本
    if(system.mac && ua.indexOf("Mobile") > -1){
        if(/CPU (?:iPhone )?OS (\d+.\d+)/.test(ua)){
            system.ios = parseFloat(RegExp["$1"].replace("_","."));
        }else{
            system.ios = 2; //不能真正检测出来，所以只能猜测
        }
    }

    // 检测安卓版本
    if(/Android (\d+.\d+)/.test(ua)){
        system.android = parseFloat(RegExp["$1"]);
    }

    // 检测游戏系统
    system.wii = ua.indexOf("wii") > -1;
    system.ps = /playstation/i.test(ua);

    if (browser.ver == 6) {
        try {
            document.execCommand("BackgroundImageCache", false, true);
        } catch(e) {}
    }

    $B.engine = engine;
    $B.browser = browser;
    $B.system = system;
}());