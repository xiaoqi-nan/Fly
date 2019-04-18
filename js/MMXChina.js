(function (w, d) {
    if (!window.MMX) {
        window.MMX = {};
    }
    MMX = {
        name: 'MMXChina Javascript Library',
        version: '1.1',
        debug: true,
        namespace: function (name) {
            var parts = name.split('.');
            var current = MMX;
            for (var i in parts) {
                if (!current[parts[i]]) {
                    current[parts[i]] = {};
                }
                current = current[parts[i]];
            }
        },
        isBrowser: function (name) {
            /// <summary>
            /// 验证浏览器方法
            /// </summary>
            /// <param name="name" type="String">浏览器名称</param>
            /// <returns type="Boolean" >返回true或false</returns>
            var ret = false;
            var userAgent = navigator.userAgent.toLowerCase();
            switch (name.toLowerCase()) {
                case "opera":
                    ret = /opera/.test(userAgent);
                    break;
                case "ie":
                    ret = /msie/.test(userAgent) && !/opera/.test(userAgent);
                    break;
                case "ie6":
                    ret = /msie 6.0/.test(userAgent);
                    break;
                case "safari":
                    ret = /webkit/.test(userAgent);
                    break;
                case "ff":
                    ret = /firefox/.test(userAgent);
                    break;
                case "wx":
                    ret = /micromessenger/.test(userAgent);
                    break;
            }
            return ret;
        },
        getQueryString: function (name) {
            /// <summary>
            /// 获取Url参数
            /// </summary>
            /// <param name="name" type="String">参数名</param>
            /// <returns type="String" >返回参数值</returns>
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = location.search.substr(1).match(reg);
            if (r !== null)
                return unescape(r[2]);
            return null;
        },
        urlEncode: function (url) {
            /// <summary>
            /// 对url编码
            /// </summary>
            /// <param name="url" type="String">url地址</param>
            /// <returns type="String" >返回编号后的url</returns>
            var ret = '';
            var x = 0;
            url = url.toString();
            var regex = /(^[a-zA-Z0-9-_.]*)/;
            while (x < url.length) {
                var match = regex.exec(url.substr(x));
                if (match != null && match.length > 1 && match[1] != '') {
                    ret += match[1];
                    x += match[1].length;
                } else {
                    if (url.substr(x, 1) == ' ') {
                        ret += '+';
                    }
                    else {
                        var charCode = url.charCodeAt(x);
                        var hexVal = charCode.toString(16);
                        ret += '%' + (hexVal.length < 2 ? '0' : '') + hexVal.toUpperCase();
                    }
                    x++;
                }
            }
            return ret;
        },
        loadScript: function (obj, callback) {
            /// <summary>
            /// 动态引用JS
            /// </summary>
            /// <param name="obj" type="Object">JS的地址,可以为数字</param>
            /// <param name="callback" type="Object">回调函数</param>
            var self = this,
			arr = obj,
			timeout,
			num = 0,
			str = typeof obj === 'string';
            if (!arr) {
                return;
            }
            function add() {
                if (arr[0] === undefined) {
                    return;
                }
                var script = document.createElement('script'),
                header = d.getElementsByTagName("head")[0];
                script.setAttribute('src', (str ? obj : arr[num]));
                if (str) {
                    if (script.readyState) {
                        script.onreadystatechange = function () {
                            if (script.readyState === 'loaded' || script.readyState === 'complete') {
                                script.onreadystatechange = null;
                                callback && callback();
                            }
                        };
                    } else {
                        script.onload = function () {
                            callback && callback();
                        };
                    }
                } else {
                    if (arr.length >= 1) {
                        if (script.readyState) {
                            script.onreadystatechange = function () {
                                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                                    script.onreadystatechange = null;
                                    arr.shift();
                                    timeout = setTimeout(add, 1);
                                }
                            };
                        } else {
                            script.onload = function () {
                                arr.shift();
                                timeout = setTimeout(add, 1);
                            };
                        }
                    } else {
                        clearTimeout(timeout);
                        callback && callback();
                    }
                }
                header.appendChild(script);
            }
            add();
        },
        Ajax: {
            jsonp: function (reqUrl, name, code, page, fnName) {
                /// <summary>
                /// 跨域Ajax请求
                /// </summary>
                /// <param name="reqUrl" type="String">要请求的地址</param>
                /// <param name="code" type="String">参数code</param>
                /// <param name="page" type="String">请求的地址</param>
                /// <param name="fnName" type="String">请求成功后执行的方法名</param>
                var url = reqUrl + '?name=' + name + '&code=' + code + '&jsoncallback=' + fnName + '&page=' + MMX.urlEncode(page);
                MMX.loadScript(url);
            }
        },
        Music: {
            play: function (options) {
                var opts = {
                    audio: null,
                    url: '',
                    autoplay: false,
                    loop: false,
                    preload: false,
                    controls: false,
                    music: 'on',
                    playing: false,
                    className: '',
                    classOn: '',
                    classOff: ''
                };
                opts = options;
                if (opts.audio == null) {
                    if (options.url) {
                        opts.audio = document.createElement("audio");
                        if (options.autoplay)
                            opts.audio.autoplay = "autoplay";
                        if (options.loop)
                            opts.audio.loop = "loop";
                        if (options.preload)
                            opts.audio.preload = "preload";
                        if (options.controls)
                            opts.audio.controls = "controls";
                        opts.audio.src = options.url;
                        opts.audio.oncanplay = function () {
                            setTimeout(function () {
                                opts.audio.play();
                                opts.audio.oncanplay = null;
                            }, 500);
                        };
                    }
                } else {
                    if (!opts.audio)
                        return opts;
                    opts.audio.play();
                }
                opts.playing = true;
                opts.music = "on";
                var ss = document.querySelector("." + opts.className);
                if (ss)
                    ss.className = opts.className + ' ' + opts.classOn
                return opts;
            },
            stop: function (options) {
                var opts = options;
                if (opts.audio)
                    opts.audio.pause();
                opts.playing = false;
                opts.music = "off";
                opts.audio.oncanplay = null;
                var ss = document.querySelector("." + opts.className);
                if (ss)
                    ss.className = opts.className + ' ' + opts.classOff;
                return opts;
            },
            toggle: function (options) {
                var opts = options;
                if (opts.playing)
                    opts = MMX.Music.stop(opts);
                else
                    opts = MMX.Music.play(opts);
                return opts;
            }
        },
        Image: {
            autoResize: function (maxWidth, maxHeight, objImg, imgSrc) {
                var opts = {
                    width: 0,
                    height: 0,
                    x: 0,
                    y: 0
                };
                var img = new Image();
                img.src = imgSrc || objImg.src;
                var hRatio;
                var wRatio;
                var Ratio = 1;
                var w = img.width;
                var h = img.height;
                wRatio = maxWidth / w;
                hRatio = maxHeight / h;
                if (maxWidth == 0 && maxHeight == 0) {
                    Ratio = 1;
                } else if (maxWidth == 0) {
                    if (hRatio < 1) Ratio = hRatio;
                } else if (maxHeight == 0) {
                    if (wRatio < 1) Ratio = wRatio;
                } else if (wRatio < 1 || hRatio < 1) {
                    Ratio = (wRatio <= hRatio ? wRatio : hRatio);
                } else if (wRatio > 1) {
                    var whRatio = w / h;
                    w = maxWidth;
                    h = w / whRatio;
                }
                if (Ratio < 1) {
                    w = w * Ratio;
                    h = h * Ratio;
                }
                opts.width = Math.round(w);
                opts.height = Math.round(h);
                if (h < maxHeight) { // 纵向有空余空间
                    opts.y = Math.round((maxHeight - h) / 2);
                }
                if (w < maxWidth) { // 横向有空余空间
                    opts.x = Math.round((maxWidth - w) / 2);
                }
                return opts;
            }
        }
    };
    MMXChina = MMX;
})(window, document);