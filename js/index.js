var html = document.documentElement;
var height = html.clientHeight;
var data = [];
var base64 = [];
var cityOption;
var cityVal = 26;
var cp = [];
var numberOfPoints = 100;
var curve = [];
var rotate, planeTrail;
var marginTop;
var start, end, ms = 0;
var planeAni;
var element;
var sendId = '';//送的对象
var tollgete = 0;//关卡
//加载图片
var loader = new resLoader({
    resources: [
        'images/1.png',
        'images/2.png',
        'images/3.png',
        'images/bg3.jpg',
        'images/bg4.jpg',
        'images/bg5.png',
        'images/bigmap2.png',
        'images/bigTip.png',
        'images/boy.png',
        'images/boy2.png',
        //'images/big8.png',
        'images/4.svg',
        'images/checked.png',
        'images/close.png',
        'images/compass.png',
        'images/down.png',
        'images/explainInfo.png',
        'images/explainInfo1.png',
        'images/girl.png',
        'images/girl2.png',
        'images/checked.png',
        'images/heart.png',
        'images/heart2.png',
        'images/heart3.png',
        'images/heart4.png',
        'images/heartBg1.png',
        'images/heartBg2.png',
        'images/homeBg.jpg',
        'images/plane.png',
        'images/saveImg.png',
        'images/tip.png',
        'images/title.png',
        'images/unchecked.png',
        'images/code_1.png',
        'images/code_2.png'
    ],
    onStart: function (total) {
    },
    onProgress: function (current, total) {
    },
    onComplete: function (total) {
        $('#loading').hide();
        $('.main').show();
    }
});
(function () {
    loader.start();
    RegUser();
    shareFn();
    var viewport = document.getElementById("metav");
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.toUpperCase().indexOf('IPHONE') > -1 || ua.toUpperCase().indexOf('IPOD') > -1) {
        $('.terminalItem').css({ 'width': '564px', 'height': '88px', 'line-height': '88px', 'border-radius': '4px' });
        $('#terminal').css({ 'line-height': '88px' });
    }
    $('.main').css('height', height + 'px');
    $('.page').css('height', height + 'px');
    var gameLine = (height - 1004) / 2;
    $('.gameLine').css('margin-top', gameLine + 'px');
    var errorHeight = (height - 434) / 2 / 2 / 2;
    $('.error').css('margin-top', errorHeight - 25 + 'px');
    data = ['images/bg4.jpg', 'images/heartBg' + TypeId + '.png'];
    data[2] = Head;  //用户头像链接
    compose();
})();
$(function () {
    element = document.getElementById('btnFly');
    cityOption = document.getElementById('city');
    citySpot();
  
    $('#city').change(function () {
        $('.tipIcon').hide();
        $('#cityInfo').html($('#city option:selected').text());
        $('.cityError').html('');
        cityVal = parseInt($('#city option:selected').val()) - 1;
        $('.place' + (cityVal + 1) + '').show();
        $('.place28').show().css('text-align', 'right');
    });
    $('#terminalSelect').change(function () {
        $('#terminal').html($('#terminalSelect option:selected').text());
        $('.error').html('');
    });
    $('#btnSubmit').click(function () {
        var name = $('#name').val().replace(/\s/ig, '');
        if (name == '') {
            $('.error').html('请填写您的姓名');
            return;
        }
        var phone = $('#phone').val().replace(/\s/ig, '');
        if (phone == '') {
            $('.error').html('请填写您的联系方式');
            return;
        }
        var phonePattern = /^0?1[3|4|5|8|7][0-9]\d{8}$/;
        if (!phonePattern.test(phone)) {
            $('.error').html('请正确填写您的联系方式');
            return;
        }
        var terminal = $('#terminal').html();
        if (terminal == '出 发 航 站') {
            $('.error').html('请选择您的出发航站');
            return;
        }
        var address = $('#address').val().replace(/\s/ig, '');
        if (address == '') {
            $('.error').html('请填写您的邮寄地址');
            return;
        }
        var uInfo = name + ',' + phone + ',' + terminal + ',' + address;
        RegInfo(uInfo);
        pageToggle('fillSuccess');

    });
    $('.txtInut').focus(function () {
        $('.error').html('');
    });
    $('.btnConfirm').click(function () {
        var cityValue = $('#city option:selected').text();
        if (cityValue == '请选择您的出发地') {
            $('.cityError').html('请选择您的出发地');
            return;
        }
        $('.loading').show();
        $('#img').show();
        var loader = new resLoader({
            resources: [
                'images/4.svg',
            ],
            onStart: function (total) {
            },
            onProgress: function (current, total) {
            },
            onComplete: function (total) {
                $('#loading').hide();
                cityFn(cityVal);
                $('#destinationPop').hide();
            }
        });
        loader.start();
    });
    $('.btnGoback').click(function () {
        $('#city').val(0);
        $('#cityInfo').html($('#city option:selected').text());
        $('#bigMap').css({ 'transform': 'scale(0.089)', 'transform-origin': '0% 0%', 'margin-top': '84px' });
        $('.tipIcon').hide();
        $('.canvasItem').css('opacity', 0).hide();
        $('.gameFill').css('width', '0%');
        $('.heartIcon').css('left', '0px');
        $('canvas').remove();
        $('.heartFill1').removeClass('h2');
        tollgete = 0;
        $('.station').html('第一关');
        $('.stationName').html('香港赏花车');
        pageToggle('homePage');
    })
})

//动态添加城市在地图上的点
function citySpot() {
    var strHtml = '';
    for (var i = 1; i < cityOption.options.length; i++) {
        strHtml += '<div class="tipIcon place' + i + '"><span>' + cityOption.options[i].text + '</span></div>'
    }
    $('.bigMap').append(strHtml);
}

function Point2D(x, y) {
    this.x = x || 0.0;
    this.y = y || 0.0;
}
//贝塞尔曲线
function PointOnCubicBezier(cp, t) {
    var ax, bx, cx;
    var ay, by, cy;
    var tSquared, tCubed;
    var result = new Point2D;
    /*計算多項式係數*/
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;
    /*計算位於參數值t的曲線點*/
    tSquared = t * t;
    tCubed = tSquared * t;
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    return result;
}

function ComputeBezier(cp, numberOfPoints, curve) {
    var dt;
    var i;
    dt = 1.0 / (numberOfPoints - 1);
    for (i = 0; i < numberOfPoints; i++)
        curve[i] = PointOnCubicBezier(cp, i * dt);
}
//长按开始
function startFn() {
    $('#planeItem').addClass('planeAni1');
    $('#btnFly').css('background-color', '#650101');
    event.preventDefault();
    start = new Date().getTime();
}
//长按结束
function endFn() {
    $('#btnFly').css('background-color', '#016565');
    $('#planeItem').removeClass('planeAni1');
    element.removeEventListener("touchstart", startFn);
    element.removeEventListener('touchend', endFn);
    event.preventDefault();
    end = new Date().getTime();
    ms = (end - start) / 100;
    console.log(start + '|' + end + '|' + ms);
    var timeArray = cityList[cityVal].time;
    cp = [new Point2D(cityList[cityVal].startX, cityList[cityVal].startY), new Point2D(cityList[cityVal].control1X, cityList[cityVal].control1Y), new Point2D(cityList[cityVal].control2X, cityList[cityVal].control2Y), new Point2D(cityList[cityVal].endX - cityList[cityVal].planeWidth, cityList[cityVal].endY)];
    var rotate1;
    switch (cityVal) {
        case 22:
            rotate1 = 0.5;
            break;
        case 24:
            rotate1 = 0.5;
            break;
        case 26:
            rotate1 = 0.5;
            break;
        default:
            rotate1 = 1;
    }
    planeTrail = setInterval(function () {
        $('#plane').css('-webkit-transform', "rotate(" + (rotate += rotate1) + "deg)");
    }, 100);
    if (ms > timeArray[0] && ms <= timeArray[1]) {
        setTimeout(function () {
            switch (tollgete) {
                case 2:
                    pageToggle('fillInfo');
                    $('.gameFill').animate({ width: '100%' }, 1500);
                    $('.heartIcon').animate({ left: '100%' }, 1500);
                    break;
                case 0:
                    tollgete++;
                    $('.gameFill').animate({ width: '33%' }, 1500);
                    $('.heartIcon').animate({ left: '33%' }, 1500);
                    $('.heartFill1').addClass('h1');
                    $('#successPage').show();
                    $('.successInfo').html('飞跃成功!<br>爱拼才会赢，快去挑战下一关!');
                    break;
                case 1:
                    tollgete++;
                    $('.gameFill').animate({ width: '66%' }, 1500);
                    $('.heartIcon').animate({ left: '66%' }, 1500);
                    $('.heartFill1').removeClass('h1').addClass('h2');
                    $('#successPage').show();
                    $('.successInfo').html('飞跃成功!<br>爱拼才会赢，快去挑战最后一关!');
                    break;
                default:
            }
        }, ms * 100)
    } else if (ms < timeArray[0]) {
        var ms2 = ms;
        ms = timeArray[1];
        setTimeout(function () {
            clearInterval(planeAni);
            clearInterval(planeTrail);
            $('#failPage').show();
        }, ms2 * 100);
    } else {
        var ms2 = ms;
        ms = timeArray[2];
        setTimeout(function () {
            clearInterval(planeTrail);
            var k = parseInt($('#planeItem').css('left'));
            var k2 = k + (cityList[cityVal].endX / timeArray[1] * (ms2 - timeArray[1]));
            var longTime = (cityList[cityVal].endX - cityList[cityVal].startX) / timeArray[1];
            time2 = setInterval(function () {
                dot.style.left = k + 'px';
                k++;
                if (k > 740) {
                    clearInterval(time2);
                    $('#failPage').show();
                }
                if (k > k2) {
                    clearInterval(time2);
                    $('#failPage').show();
                }
            }, longTime);
        }, ms * 100)
    }
    ComputeBezier(cp, numberOfPoints, curve);
    var i = 0, dot = document.getElementById("planeItem");
    marginTop = parseInt(cityList[cityVal].planeMargin);
    planeAni = setInterval(function () {
        var j = (i < 100) ? i : (199 - i);
        dot.style.left = curve[j].x + 'px';
        dot.style.top = curve[j].y + 'px';
        console.log(dot.style.left + ' ' + dot.style.top)
        marginTop += cityList[cityVal].planeMarginTop;
        $('#planeItem').css('margin-top', marginTop + "px");
        if (++i == 100) {
            clearInterval(planeAni);
            clearInterval(planeTrail);
        };
    }, ms);
}
function compose() {
    draw(function () {
        $('#imgItem').html('');
        document.getElementById('imgItem').innerHTML = '<img src="' + base64[0] + '">';
    });
}
//图片合成
function draw(fn) {
    var c = document.createElement('canvas'),
        ctx = c.getContext('2d'),
        len = data.length;
    c.width = 720;
    c.height = height;
    ctx.rect(0, 0, c.width, c.height);
    ctx.fillStyle = '#dad2bc';
    ctx.fill();
    function drawing(n) {
        if (n < len) {
            var img = new Image;
            img.src = data[n];
            img.setAttribute("crossOrigin", 'Anonymous');
            img.onload = function () {
                switch (n) {
                    case 0:
                        ctx.drawImage(img, 0, 0, 720, height);
                        break;
                    case 1:
                        ctx.drawImage(img, 0, (height / 2) - 262, 720, 524);
                        break;
                    case 2:
                        ctx.drawImage(img, 193, (height / 2) - 55, 148, 148);
                        break;
                    default:
                }
                drawing(n + 1);
            }
        } else {
            base64.push(c.toDataURL('image/jpeg', 0.8));
            fn();
        }
    }
    drawing(0);
}
//点击我已阅读
function chooseFn(obj) {
    var $obj = $(obj).find('.readIcon');
    if ($($obj).hasClass('unchecked')) {
        $($obj).removeClass('unchecked');
        return;
    }
    $($obj).addClass('unchecked');
}
//游戏详情
function explainFn() {
    pageToggle('explainPage');
}

//页面切换
function pageToggle(id) {
    $('.page').hide();
    $('#' + id).show();
}
//开始游戏
function beginFn(id) {
    if ($('.readIcon').hasClass('unchecked')) {
        return;
    }
    pageToggle(id);
}
//选择性别
function chooseSexFn(id, obj) {
    var sexId = $(obj).attr('id');
    $('#sex').attr('src', 'images/' + sexId + '2.png')
    pageToggle(id);
}
//选择送的对象
function sendFn(obj, id) {
    sendId = parseInt($(obj).attr('id').split('_')[1]);
    pageToggle(id);
    $('#gamePage').show();
}
function cityFn(cityVal) {
    rotate = parseInt(cityList[cityVal].planeRotate);
    if (cityVal <= 20) {
        $('.place28').css('text-align', 'right');
    }
    mapAnimate(cityList[cityVal].scale, cityList[cityVal].rotate, cityList[cityVal].moveX, cityList[cityVal].moveY);
    $('.tipIcon').hide();
    $('.place' + (cityVal + 1) + '').show();
    $('.place28').show();
    $('#planeItem').css({
        "margin": cityList[cityVal].planeMargin,
        "top": "" + cityList[cityVal].startY + "px",
        "left": "" + cityList[cityVal].startX + "px"
    });
    $('#plane').css({
        "-webkit-transform": "rotate(" + cityList[cityVal].planeRotate + ")"
    });
    var userHeadImg = cityList[cityVal].userHeadImg;
    $('#userHeadImg').css({ 'top': userHeadImg[0] + 'px', 'left': userHeadImg[1] + 'px' });
    $('#userHeadImg').attr('src', data[2]);
    setTimeout(function () {
        element.addEventListener("touchstart", startFn);
        element.addEventListener('touchend', endFn);
        canvasLine('canvas', cityList[cityVal].startX, cityList[cityVal].startY, cityList[cityVal].control1X, cityList[cityVal].control1Y, cityList[cityVal].control2X, cityList[cityVal].control2Y, cityList[cityVal].endX, cityList[cityVal].endY);
        $('.canvasItem').show().animate({ 'opacity': 1 }, 500);
    }, 2500);
}
//飞机飞行轨迹
function canvasLine(id, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY) {
    var canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 564;
    //canvas = document.getElementById(id);
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.setLineDash([10, 15]);
    ctx.lineWidth = 3;
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(control1X, control1Y, control2X, control2Y, endX, endY);
    ctx.strokeStyle = "#A95A55";
    ctx.stroke();
    $('.game').append(canvas);
}
//地图旋转放大动画
function mapAnimate(scale, rotate, moveX, moveY) {
    $(".bigMap").animate({}, function () {
        $(".bigMap").css({
            '-webkit-transform': 'translate(' + moveX + ',' + moveY + ') scale(' + scale + ') rotate(' + rotate + ')',
            "-webkit-transform-origin": "50% 50%",
            "margin-top": "0"
        });
    });
    $('.tipIcon').animate({}, function () {
        var tipRotate = (-parseInt(rotate)) + 'deg';
        $('.tipIcon').css({ '-webkit-transform': "rotate(" + tipRotate + ") scale(" + 1 / scale + ")" });
    });
    $('.compass').animate({}, function () {
        $('.compass').css({ "-webkit-transform": "rotate(" + rotate + ")" });
    });
}
//重新开始
function restartFn() {
    $('#planeItem').css({
        "margin": cityList[cityVal].planeMargin,
        "top": "" + cityList[cityVal].startY + "px",
        "left": "" + cityList[cityVal].startX + "px"
    });
    $('#plane').css({
        "-webkit-transform": "rotate(" + cityList[cityVal].planeRotate + ")"
    })
    rotate = parseInt(cityList[cityVal].planeRotate);
    element.addEventListener("touchstart", startFn);
    element.addEventListener('touchend', endFn);
    $('#failPage').hide();
    //if (tollgete != 0) {
    //    goonFn();
    //}
}
//继续飞一飞
function goonFn() {
    $('canvas').remove();
    $('.canvasItem').css('opacity', 0);
    $('#successPage').hide();
    $('#failPage').hide();
    switch (sendId) {
        case 1:
            switch (tollgete) {
                case 1:
                    $('.station').html('第二关');
                    $('.stationName').html('东京泡温泉');
                    cityVal = 21;
                    break;
                case 2:
                    $('.station').html('第三关');
                    $('.stationName').html('墨尔本过夏天');
                    cityVal = 22;
                    break;
                default:
            }
            break;
        case 2:
            switch (tollgete) {
                case 1:
                    $('.station').html('第二关');
                    $('.stationName').html('科伦坡看茶园');
                    cityVal = 23;
                    break;
                case 2:
                    $('.station').html('第三关');
                    $('.stationName').html('洛杉矶买买买');
                    cityVal = 24;
                    break;
                default:
            }
            break;
        case 3:
            switch (tollgete) {
                case 1:
                    $('.station').html('第二关');
                    $('.stationName').html('暹粒观佛像');
                    cityVal = 25;
                    break;
                case 2:
                    $('.station').html('第三关');
                    $('.stationName').html('都柏林游名胜');
                    cityVal = 26;
                    break;
                default:
            }
            break;
        default:
    }
    cityFn(cityVal);
}
//分享
function shareFn() {
    if ($.isWeiXin()) {
      
        $.wxConfig({
            debug: false,
            shared: true,
            title: '有奖互动∣飞一飞，为爱赢机票',
            desc: '玩游戏，赢双人机票及众多好礼',
            link: 'http://gt.mmx-china.net/Activity201802/share.html?openid=' + OpenId + '&typeid=' + TypeId,
            imgUrl: 'http://gt.mmx-china.net/Activity201802/images/share.jpg',
            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo"],
            name: '755d8e604b4788c7',
            code: 'a707d7bfbbe90dbe4d63109f5c8ff1c0',
        }, success_Function);
    }
}
function success_Function() { }