/*
 * 后台Api接口
 */
(function (w, fun) {
    if (typeof (fun) == "function") {
        w.Api = fun(w);
    }
})(window, function (w) {
    var api = {
        v: w.Vue,
        //本地编译运行会使用 api_local_debug 替换
        options: {
            baseUrl: 'http://sport.weguess.cn/api/',//api base url
            RankUrl: "http://m.weguess.cn/memberapi/api/WeChat/WinRateRank",
            PublishUrl: "http://m.weguess.cn/memberapi/api/WeChat/PublishBet",
            TokenUrl: "http://m.weguess.cn/MemberApi/Api/WeChat/GetToken",
            NoticeUrl: "http://m.weguess.cn/MemberApi/Api/WeChat/GetNotice",
            token: ""
        },
        Balance: -1,
        //基础请求
        Request: function (type, url, params, successfun, failfun, timeout) {
            timeout = parseInt(timeout);
            if (isNaN(timeout)) {
                timeout = null;
            }
            if (type == "get") {
                var arr = [];
                for (var key in params) {
                    if (params.hasOwnProperty(key)) {
                        arr.push(key + "=" + params[key]);
                    }
                }
                var str = arr.join("&");
                api.v.http.get(url + "?" + str, {
                    headers: {
                        Authorization: api.options.token || "",
                        QIC: window.$config.AgentKey
                    },
                    timeout: timeout || 20000
                }).then(function (data) {
                    if (data && data.hasOwnProperty("body")) {
                        if (typeof (successfun) == "function") {
                            successfun(data.body);
                        }
                    }
                }, function (error) {
                    try {
                        if (error.status == "500") {
                            window.vbus.$emit("ShowToast", "500错误 Token验证失败");
                        }
                    } catch (e) {

                    }

                    if (typeof (failfun) == "function") {
                        failfun(error);
                    }
                });
            } else if (type == "post") {
                api.v.http.post(url, params, {
                    headers: {
                        Authorization: api.options.token || "",
                        QIC: window.$config.AgentKey
                    },
                    timeout: timeout || 20000
                }).then(function (data) {
                    if (data && data.hasOwnProperty("body")) {
                        if (typeof (successfun) == "function" && data.body) {
                            successfun(data.body);
                        }
                    }
                }, function (error) {
                    if (typeof (failfun) == "function") {
                        failfun(error);
                    }
                });
            }
        },
        //api请求
        //api都需调用此方法
        //验证Token是否存在，不存在则获取后请求(为分享单页)
        APIRequest: function (type, apiname, params, successfun, failfun, timeout) {
            api.GetToken(function (token) {
                api.options.token = token;
                api.Request(type, api.options.baseUrl + apiname, params, successfun, failfun, timeout);
            });
        },
        GetRankList: function (isWeek, success, fail) {
            api.GetToken(function () {
                var p = (!!isWeek) ? 0 : 1;
                api.Request("get", api.options.RankUrl, { Type: p }, success, fail);
            });

        },
        //注单发布
        PublishBet: function (params, success, fail) {
            api.GetToken(function () {
                api.Request("post", api.options.PublishUrl, params, success, fail);
            });
        },
        //获取Token
        GetToken: function (callback) {
            var token = "";
            try {
                token = top.$Token.Get();
            } catch (e) {
                token = "";
                console.log("getToken error ", e);
            }
            if (!token) {
                console.log("获取Token失败");
                setTimeout(function () { window.vbus.$emit("ShowToast", "获取Token失败"); }, 1000);
            }

            if (typeof (callback) == "function") {
                callback(token);
                return;
            }
        },
        //获取余额
        GetBalance: function (successfun, failfun) {
            api.APIRequest("get", "getbalance", null, function (d) {
                if (d.Success) {
                    successfun(d.Data);
                } else {
                    failfun(d);
                }
            }, failfun);
        },
        //竞猜
        //获取按时间
        GetOddsByTime: function (params, successfun, failfun) {
            api.APIRequest("get", "getdatemenu", params, successfun, failfun);
        },
        //获取按联赛
        GetOddsByLeague: function (params, successfun, failfun) {
            api.APIRequest("get", "getleaguemenu", params, successfun, failfun);
        },
        //获取滚球
        GetOddsByLive: function (params, successfun, failfun) {
            if (params) {
                params["isMix"] = false;
            }
            api.APIRequest("get", "getweguessmatchodds", params, successfun, failfun);
        },
        //获取混合过关
        GetOddsByMix: function (params, successfun, failfun) {
            if (params) {
                params["isMix"] = true;
            }
            api.APIRequest("get", "getweguessmatchodds", params, successfun, failfun);
        },
        //获取详细比赛
        GetMatchOdd: function (params, successfun, failfun) {
            api.APIRequest("get", "getmatchdata", params, successfun, failfun);
        },
        //获取一般投注
        GetBet: function (params, successfun, failfun) {
            api.APIRequest("get", "getbet", params, successfun, failfun);
        },
        //获取混合过关投注
        GetMixBet: function (params, successfun, failfun) {
            api.APIRequest("get", "getmixbet", params, successfun, failfun);
        },
        //一般投注
        Bet: function (params, successfun, failfun) {
            api.APIRequest("post", "bet", params, successfun, failfun);
        },
        //混合过关投注
        BetMix: function (params, successfun, failfun) {
            api.APIRequest("post", "mixbet", params, successfun, failfun);
        },
        //赛事
        //即时数据
        GetTimeLeague: function (params, successfun, failfun) {
            api.APIRequest("get", "getmatchlivedata", params, successfun, failfun);
        },
        //赛果数据
        GetResultLeague: function (params, successfun, failfun) {
            api.APIRequest("get", "getmatchresult", params, successfun, failfun);
        },
        //赛程数据
        GetProcessLeague: function (params, successfun, failfun) {
            api.APIRequest("get", "getmatchschedule", params, successfun, failfun);
        },
        //未结算注单列表
        GetUnbalancedBets: function (successCallBack, failCallBack) {
            api.APIRequest("get", "getunbalancedbetlist", {}, successCallBack, failCallBack);
        },
        //结算注单日期列表
        GetBalancedBetDate: function (successCallBack, failCallBack) {
            api.APIRequest("get", "getbalancedbetdate", {}, successCallBack, failCallBack);
        },
        //结算注单
        GetBalancedBets: function (repDate, successCallBack, failCallBack) {
            api.APIRequest("get", "getbalancedbetlist", { repDate: repDate }, successCallBack, failCallBack);
        }

    }
    return api;
});