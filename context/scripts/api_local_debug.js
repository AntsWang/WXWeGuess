//仅本地测试时使用 编译发布后不会包含本脚本
(function (w) {
    console.log("当前运行在本地测试模式!");
    w.Api.GetToken = function (callback) {
        var token = "";
        console.log("使用固定openid生成Token");
        //本地测试获取token
        Api.v.http.get(Api.options.baseUrl + "generatetoken?openid=122&isTourist=false").then(function (data) {
            if (typeof (callback) == "function") {
                callback(data.body);
            }
        },
            function (e) {
                if (typeof (callback) == "function") {
                    callback(e.statusText);
                }
            });
    };
    w.Api.options.baseUrl = "http://192.168.0.6:8384/api/";
    w.Api.options.RankUrl = "http://192.168.0.133:803/memberapi/api/WeChat/WinRateRank";
    w.Api.options.PublishUrl = "http://192.168.0.133:803/memberapi/api/WeChat/PublishBet";
    console.log("使用" + w.Api.options.baseUrl + "作为API地址");
})(window);

