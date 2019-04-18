var AppId = '', Timestamp = '', NonceStr = '', Signature = '';
(function ($) {
    $.wxConfig = function (options, callback) {
        var defaults = {
            reqUrl: 'http://api.mmxchina.com/weixin/share/Index.ashx',
            page: window.location.href,
            name: '',
            code: '',
            debug: false,
            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo"]
        };
        var opts = $.extend(defaults, options);
        $.ajax({
            type: 'GET',
            url: opts.reqUrl + '?name=' + opts.name + '&code=' + opts.code + '&page=' + MMX.urlEncode(opts.page),
            dataType: 'jsonp',
            jsonp: "jsoncallback",
            success: function (data) {
                if (data.appId) {
                    AppId = data.appId;
                    Timestamp = data.timestamp;
                    NonceStr = data.nonceStr;
                    Signature = data.signature;
                    wx.config({
                        debug: opts.debug,
                        appId: AppId,
                        timestamp: Timestamp,
                        nonceStr: NonceStr,
                        signature: Signature,
                        jsApiList: opts.jsApiList
                    });
                    shareCofing(opts.title, opts.desc, opts.link, opts.imgUrl, opts.shared, callback);
                }
                return;
            },
            error: function () {
            }
        });
    };
    $.isWeiXin = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') { 
            return true;
        } else {
            return false;
        }
    }
})(jQuery);
//分享调用方法
function shareCofing(sTitle, sDesc, sLink, sImgUrl, share, callback) {
    wx.ready(function () {
        if (!share) {
            wx.hideOptionMenu();
            return;
        }
        wx.showOptionMenu();
        //获取“分享到朋友圈”
        wx.onMenuShareTimeline({
            title: sTitle,
            desc: sDesc,
            link: sLink,
            imgUrl: sImgUrl,
            success: function (res) {
                callback(res);
            },
            cancel: function () {
            }
        });
        //获取“分享给朋友”
        wx.onMenuShareAppMessage({
            title: sTitle,
            desc: sDesc,
            link: sLink,
            imgUrl: sImgUrl,
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function (res) {
                callback(res);
            },
            cancel: function () {
            }
        });
        //获取“分享到QQ”
        wx.onMenuShareQQ({
            title: sTitle,
            desc: sDesc,
            link: sLink,
            imgUrl: sImgUrl,
            success: function (res) {
                callback(res);
            },
            cancel: function () {
            }
        });
        //获取“分享到腾讯微博”
        wx.onMenuShareWeibo({
            title: sTitle,
            desc: sDesc,
            link: sLink,
            imgUrl: sImgUrl,
            success: function (res) {
                callback(res);
            },
            cancel: function () {
            }
        });
    });
    wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。;
    });
}
