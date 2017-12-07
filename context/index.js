/*
 * 配置路由
 */
var router = new VueRouter({
    //mode:"history",
    routes: [
		{ path: '/guess/:type/:sportId/:index', name: 'guess', component: window.component.guessPage }, //竞猜
		{ path: '/leagues/:type/:sportId/:date', name: 'leagues', component: window.component.leaguesPage }, //赛事
		{ path: '/match/:matchId/:marketid/:betpos', name: 'match', component: window.component.match }, //详细比赛
		{ path: '/betlist/:type/:date', name: 'betlist', component: window.component.betlist }, //投注记录
		{ path: '/ranking', name: 'ranking', component: window.component.ranking }, //排行榜
        { path: '/rule', name: 'rule', component: window.component.rule }, //规则

       // { path: '/guess/:type/:sportId', name: 'guessx', component: window.component.guessPage }, //竞猜
		//{ path: '/leagues/:type/:sportId/:date', name: 'leaguesx', component: window.component.leaguesPage }, //赛事
		//{ path: '/match/:matchId', name: 'matchx', component: window.component.match }, //详细比赛
		//{ path: '/betlist', name: 'betlistx', component: window.component.betlist }, //投注记录
		//{ path: '/ranking', name: 'rankingx', component: window.component.ranking } //排行榜
    ]
});
var resourece = new VueResource();
Vue.http.options.emulateJSON = true;

function IsLeaglRouterParam(s) {
    if (s == undefined) {
        return false;
    }
    try {
        s = decodeURIComponent(s);
    } catch (e) {
        s = s;
    }
    if (s == null || s == "" || s == " ") {
        return false;
    }
    return true;
}


try {

} catch (e) {

}

var w = window;
window.vbus = new Vue({
    el: "#global_component",
    template: '<div class="toastcont" id="global_comp"><div @click=CloseToast class="toast" v-show=show><p>{{msg}}</p></div></div>',
    name: "Global",
    created: function () {
        this.$on("UpdateBalance", this.UpdateBalance);
        this.$on("ShowToast", this.ShowToast);
        this.UpdateBalance();
        this.StartBalanceUpdater();
    },
    mounted: function () {

    },
    data: function () {
        return {
            show: false,
            msg: "",
            defaultTime: this.time || 2000
        };
    },
    methods: {
        CloseToast: function () {
            this.show = false;
        },
        ShowToast: function (msg, time, force) {
            var that = this;
            //正在显示 等待1s
            if (this.show && !force) {
                setTimeout(function () {
                    that.ShowToast(msg, time, true);
                }, 1000);
                return;
            }
            //直接显示
            this.msg = msg;
            this.show = true;
            setTimeout(function () {
                that.show = false;
            }, time || this.defaultTime);
        },
        //获取新余额数据并储存
        UpdateBalance: function (callback) {
            var that = this;
            w.Api.GetBalance(function (v) {
                w.Api.Balance = v;
                that.$emit("BalanceUpdated", v);
                if (typeof callback == "function") {
                    callback(v);
                }
            }, function (e) {
                console.log("获取余额失败", e);
                if (typeof callback == "function") {
                    callback(-1);
                }
            });
        },
        StartBalanceUpdater: function () {
            var that = this;
            setTimeout(function () {
                that.UpdateBalance(function () {
                    that.StartBalanceUpdater();
                });
            }, 30000);
        }
    }
});



/*
 * 初始化项目
 */
var wgapp = new Vue({
    el: "#sport",
    router: router,
    name: "app",
    created: function () {
        this.routeUpdate();
        vbus.$on("SetTitle", this.SetTitle);
        //top.addEventListener("popstate", function (e) {
        //    router.back();
        //},false);

    },
    mounted: function () {
        //top.onload = function (e) {
        //    if (top.location.href.indexOf("/guess") > 0 && top.location.href.indexOf("shadow") < 0) {
        //        console.log("shadow added");
        //        top.history.pushState({}, "", top.location.search ? (top.location.search + "&shadow" + top.location.hash) : ("?shadow" + top.location.hash));
        //    }
        //}
        //top.onpopstate = function (e) {
        //    if (top.location.href.indexOf("/guess") > 0 && top.location.href.indexOf("shadow") < 0) {
        //        console.log("shadow added");
        //        top.history.pushState({}, "", top.location.search ? (top.location.search + "&shadow" + top.location.hash) : ("?shadow" + top.location.hash));
        //    }
        //}
    },
    methods: {
        routeUpdate: function () {
            //解析请求地址,分发显示地址
            var arr = window.location.hash.replace("/tab/guess", "").split("/");
            if (arr instanceof Array && arr.length >= 2 && arr[1]) {
                switch (arr[1]) {
                    case "guess":
                        var gsportId = 1; //默认初始化运动为足球
                        var gtype = "time";
                        var gindex = 0;
                        if (arr.length >= 3 && arr[2]) {
                            gtype = arr[2];
                        }
                        if (arr.length >= 4 && arr[3]) {
                            gsportId = arr[3];
                        }
                        if (arr.length >= 5 && arr[4]) {
                            gindex = arr[4];
                        }
                        this.$router.push({ name: arr[1], params: { type: gtype, sportId: gsportId, index: gindex } });
                        break;
                    case "leagues":
                        var lsportId = 1; //默认初始化运动为足球
                        var ltype = "live";
                        var ldate = new Date().format("YY-MM-dd");
                        if (arr.length >= 3 && arr[2]) {
                            ltype = arr[2];
                            if (ltype == "result") {
                                ldate = new Date().getReportDate().format("YY-MM-dd");
                            } else if (ltype == "process") {
                                ldate = new Date().getReportDate().addHours(24).format("YY-MM-dd");
                            } else {
                                ltype = "live";
                            }

                        }
                        if (arr.length >= 4 && arr[3]) {
                            lsportId = arr[3];
                        }
                        if (arr.length >= 5 && arr[4]) {
                            ldate = arr[4] || ldate;
                        }
                        this.$router.push({ name: arr[1], params: { type: ltype, sportId: lsportId, date: ldate } });
                        break;
                    case "match":
                        if (arr.length < 3) {
                            this.$router.push({ name: "guess", params: { type: "time", sportId: 1, index: 0 } });
                        } else {
                            this.$router.push({ name: arr[1], params: { matchId: arr[2] } });
                        }
                        break;
                    case "betlist":
                        var type = "unbal", date = "_";
                        if (IsLeaglRouterParam(arr[2])) {
                            type = arr[2];
                        }
                        if (IsLeaglRouterParam(arr[3])) {
                            date = arr[3];
                        }
                        this.$router.push({ name: arr[1], params: { type: type, date: date } });
                        break;
                    case "ranking":
                    case "rule":
                        this.$router.push({ name: arr[1] });
                        break;
                    default:
                        this.$router.push({ name: "guess", params: { type: "time", sportId: 1, index: 0 } });
                }
            } else {
                this.$router.push({ name: "guess", params: { type: "time", sportId: 1, index: 0 } });
            }
        },
        SetTitle: function (title) {
            document.title = title;
        }
    },
    watch: {
        '$route': function (to, from) {
            // 对路由变化作出响应...  可正规化地址 
            //if (!to.params.date) {
            this.routeUpdate();
            //}
        }
    }
});

var isPulled = false;
function initScroll(wrapperid) {
    var pullDown = document.getElementById("pulldowntip");
    // 拉动足够标记
    var myScroll = new IScroll(wrapperid, {
        probeType: 3,
        mouseWheel: false,
        scrollbars: false,
        preventDefault: false,
        fadeScrollbars: true
    });
    myScroll.on('scroll', function (e, x, c, z) {
        var height = this.y,
            bottomHeight = this.maxScrollY - height;
        console.log(height);
        // 控制下拉显示
        if (height >= 60) {
            pullDown.style.display = "block";
            isPulled = true;
            return;
        } else if (height < 60 && height >= 0) {
            pullDown.style.display = "none";
            return;
        }
    });
    myScroll.on('scrollEnd', function () { // 滚动结束
        if (isPulled) { // 如果达到触发条件，则执行加载
            isPulled = false;
            alert("刷新成功!");
            myScroll.refresh();
        }
    });
}



