var OpenId = getParam("openid");
var TypeId = getParam("typeid");
$(function () {
    shareFn();
    var Head = GetHead(OpenId);
    if (Head != "0") {
        $('#userImg').attr("src", Head);
    }
    switch (TypeId) {
        case 2:
            $('#wxCode').attr("src", "images/code_2.png");
            break;
        default:
            $('#wxCode').attr("src", "images/code_1.png");
            break;
    }
})
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

function GetHead(OpenId) {
    var RegMsg = "0";
    var obj = new Object();
    obj.OpenId = OpenId;
    $.ajaxSetup({ async: false, cache: false });
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "cxService.asmx/GetHead",
        data: JSON.stringify(obj),
        dataType: 'json',
        success: function (result) {
            RegMsg = result.d;

        },
        error: function () {

        }
    });
    return RegMsg;
}

function success_Function() { }