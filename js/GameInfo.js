var mmx = getParam("mmx");
var UserInfo = "0";
var OpenId = "0";
var TypeId = 1;
var Head = "images/img.jpg";
function RegUser() {
    var RegMsg = "00";
    var obj = new Object();
    obj.mmx = mmx;
    $.ajaxSetup({ async: false, cache: false });
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "cxService.asmx/RegUser",
        data: JSON.stringify(obj),
        dataType: 'json',
        success: function (result) {
            var RegMsg = result.d;
            var infos = RegMsg.split('|');
            UserInfo = infos[0];
            Head = infos[1];
            OpenId = infos[2];
            TypeId = infos[3];
        },
        error: function () {

        }
    });
    return RegMsg;
}

function RegInfo(infos) {
    var RegMsg = "00";
    var obj = new Object();
    obj.mmx = mmx;
    obj.UserInfo = UserInfo;
    obj.infos = infos;
    $.ajaxSetup({ async: false, cache: false });
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "cxService.asmx/RegInfo",
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