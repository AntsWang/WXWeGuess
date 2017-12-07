/*
 * 混合过关
 * 传入参数为比赛列表
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['mix'] = fun(w);
})(window, function (w) {
    var mixhtml = '<div class="mixwrp"><div class="xscroll mixsubwrp"><div id="matchitem" class="mix mixpane xscroll" v-if="HasOwnProperty(matchlist,\'MH\')" >\
					<div><div class="item"   v-for="(match,index) in matchlist.MH" v-show="!IsEmptyObj(match.MK)">\
					<a class="title" @click="ChangeShow(match)">\
						<span class="league textindent">\
							<span class="back textCut lname">{{matchlist.LG[match.M[2]].LN}} </span>\
							<span class="textCut time">{{MatchDate(match.M[7])}}</span>\
						</span>\
						<span class="info block">\
							<span class="name textCut back lname">{{match.M[4]}}</span><span class="vstext">vs</span><span class="name textCut back rname">{{match.M[6]}}</span>\
						</span>\
						<i class="wgicon block floatright" :class="{\'icon_up\':match.show,\'icon_down\':!match.show}"></i>\
					</a>\
					<div class="oddpane"  v-show="match.show" >\
						<div class="oddtitle textindent back" v-if="HasOwnProperty(match.MK,\'5\')">全场赛果:<span class="gray">猜90分钟内比赛结果(含伤停补时)</span></div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'5\')">\
							<a class="threeDiv textindent block" :class="{\'selectBet\':(IsSelected(BetItem(match.MatchID,5,0,1)))}" @click=\"AssmbleBet(match.MK[\'5\'][0][1],1,match.MK[\'5\'][0][0],match.MatchID,5)\"><span class="back">{{match.M[4]}}</span><span class=\"oddbet block yellow\">{{FO(match.MK["5"][0][1])}}<i :class="{\'oddup\':((OddChange(match.MatchID,5,0,1))==1),\'odddown\':(OddChange(match.MatchID,5,0,1)==2)}"></i></span></a>\
						   	<a class="threeDiv textindent block" :class="{\'selectBet\':(IsSelected(BetItem(match.MatchID,5,0,3)))}" @click=\"AssmbleBet(match.MK[\'5\'][0][3],3,match.MK[\'5\'][0][0],match.MatchID,5)\"><span class="back">和局</span><span class=\"oddbet block yellow\">{{FO(match.MK["5"][0][3])}}<i :class="{\'oddup\':((OddChange(match.MatchID,5,0,3))==1),\'odddown\':(OddChange(match.MatchID,5,0,3)==2)}"></i></span></a>\
						   	<a class="threeDiv textindent block" :class="{\'selectBet\':(IsSelected(BetItem(match.MatchID,5,0,2)))}" @click=\"AssmbleBet(match.MK[\'5\'][0][2],2,match.MK[\'5\'][0][0],match.MatchID,5)\"><span class="back">{{match.M[6]}} </span><span class=\"oddbet block yellow bright\">{{FO(match.MK["5"][0][2])}}<i :class="{\'oddup\':((OddChange(match.MatchID,5,0,2))==1),\'odddown\':(OddChange(match.MatchID,5,0,2)==2)}"></i></span></a>\
						</div>\
						<div class="oddtitle  textindent back" v-if="HasOwnProperty(match.MK,\'1\')">全场让球:<span class="gray">猜90分钟内比赛结果(含伤停补时)</span></div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'1\')">\
						   <a class="twoDiv textindent block" :class="{\'selectBet\':(IsSelected(BetItem(match.MatchID,1,0,1)))}" @click=\"AssmbleBet(match.MK[\'1\'][0][1],1,match.MK[\'1\'][0][0],match.MatchID,1)\"><span class="back">{{match.M[4]}} {{HdpH(match.MK["1"][0][3])}}</span><span class=\"oddbet block yellow\">{{FO(match.MK["1"][0][1])}}<i :class="{\'oddup\':((OddChange(match.MatchID,1,0,1))==1),\'odddown\':(OddChange(match.MatchID,1,0,1)==2)}"></i></span></a>\
						   <a class="twoDiv textindent block" :class="{\'selectBet\':(IsSelected(BetItem(match.MatchID,1,0,2)))}" @click=\"AssmbleBet(match.MK[\'1\'][0][2],2,match.MK[\'1\'][0][0],match.MatchID,1)\"><span class="back">{{match.M[6]}} {{HdpA(match.MK["1"][0][3])}}</span><span class=\"oddbet block yellow bright\">{{FO(match.MK["1"][0][2])}}<i :class="{\'oddup\':((OddChange(match.MatchID,1,0,2))==1),\'odddown\':(OddChange(match.MatchID,1,0,2)==2)}"></i></span></a>\
						</div>\
						<div class="oddtitle  textindent back" v-if="HasOwnProperty(match.MK,\'3\')">全场大小:<span class="gray">猜90分钟内比赛结果(含伤停补时)</span></div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'3\')">\
						   <a class="twoDiv textindent block" :class="{\'selectBet\':(IsSelected(BetItem(match.MatchID,3,0,1)))}" @click=\"AssmbleBet(match.MK[\'3\'][0][1],1,match.MK[\'3\'][0][0],match.MatchID,3)\"><span class="back">大  {{Hdp(match.MK["3"][0][3])}}</span> <span class=\"oddbet block yellow\">{{FO(match.MK["3"][0][1])}}<i :class="{\'oddup\':((OddChange(match.MatchID,3,0,1))==1),\'odddown\':(OddChange(match.MatchID,3,0,1)==2)}"></i></span></a>\
						   <a class="twoDiv textindent block" :class="{\'selectBet\':(IsSelected(BetItem(match.MatchID,3,0,2)))}" @click=\"AssmbleBet(match.MK[\'3\'][0][2],2,match.MK[\'3\'][0][0],match.MatchID,3)\"><span class="back">小  {{Hdp(match.MK["3"][0][3])}}</span><span class=\"oddbet block yellow bright\">{{FO(match.MK["3"][0][2])}}<i :class="{\'oddup\':((OddChange(match.MatchID,3,0,2))==1),\'odddown\':(OddChange(match.MatchID,3,0,2)==2)}"></i></span></a>\
						</div>\
					</div>\
				</div>\
				</div></div><div class="no-data-tips" v-show="matchlist.MH==null||matchlist.MH.length==0">暂无数据</div><loading v-show="isLoading"></loading></div><a v-show="(betlist.length>0)" class="betcount" @click="InitBet()">投注单 <span class="white">{{betlist.length}}</span></a></div>';
    var mix = Vue.extend({
        template: mixhtml,
        name: "mix",
        props: ["sportId", "isShowBet","xtype"],
        data: function () {
            return {
                timer: null, //刷新时钟
                matchlist: {},
                changelist: {}, //变化列表0不变,1上升,2下降
                betlist: [], //选中列表
                showIndex: 0,
                updateTime: "", //上一次更新时间
                isLoading: true,
                selected: [],
                selectBetitem: "",
                type: this.xtype
            }
        },
        components: {
            loading: w.component.loading
        },
        watch: {
            sportId: function () { //运动类型改变
                this.DestoryTimer();
                this.isLoading = true;
                this.GetOdd(false);
            }
        },
        created: function () {
            this.isLoading = true;
            var that = this;
            this.GetOdd(false);
            //通过vbus创建事件钩子 监听betpane移除比赛等事件
            w.vbus.$on("removeMatch", this.RemoveMatch);
            w.vbus.$on("CloseBetPane", this.ClearSelected);
            w.vbus.$on("MixBetSuccess", this.ClearSelected);
            w.vbus.$on("MixBetFail", function () { });
            w.vbus.$on("ReInitMixBet", this.InitBet);
        },
        beforeDestroy: function () {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.type = "stopped";
        },
        methods: {
            FO: function (odds) {
                return w.HandleData.FormatOdds(odds);
            },
            RemoveMatch: function (m, i) {
                var sid = "{0}-{1}-{2}-{3}".format(m.MatchID, m.MarketID, 0, m.BetPos);
                var idx = this.selected.indexOf(sid);
                if (idx >= 0) {
                    this.selected.splice(idx, 1);
                }
                idx = -1;
                if (this.betlist[i] && this.betlist[i].matchId == m.MatchID) {
                    idx = i;
                } else {
                    for (var j = 0; j < this.betlist.length; j++) {
                        if (this.betlist[i].matchId == m.MatchID) {
                            idx = j;
                            break;
                        }
                    }
                }
                if (idx >= 0) {
                    this.betlist.splice(idx, 1);
                }
                this.InitBet();

            },
            ClearSelected: function () {
                this.betlist = [];
                this.selected = [];
                this.selectBetitem = "";
            },
            //获取盘口数据
            GetOdd: function (refresh, callback) {
                var gu = this;
                if (!refresh) {
                    gu.isLoading = true;
                }
                w.Api.GetOddsByMix({
                    SportId: this.sportId,
                    UpdateTime: gu.updateTime
                }, function (data) {
                    gu.isLoading = false; //取消loading
                    if (data.Success) {
                        gu.updateTime = data.Data.T;


                        if (refresh) {
                            if (typeof (callback) == "function") callback(data.Data);
                            //gu.matchlist = data.Data;
                        } else {
                            if (data.Data == null) {
                                gu.matchlist = {};
                            } else {
                                gu.matchlist = data.Data;
                            }

                            gu.ReashData();
                        }
                        gu.$nextTick(function () {
                            this.$emit("ComputedHeight");
                        });
                    } else {
                        console.log(data.ErrorMsg);
                    }
                    gu = null;
                }, function (err) {
                    gu.isLoading = false;
                    console.log("err=" + err.Message); //提示错误
                });
            },
            Hdp: function (hdp) { //计算大小hdp
                return w.HandleData.ComputeHDP(hdp);
            },
            HdpH: function (hdp) { //计算主队让球hdp
                return w.HandleData.HdpH(hdp);
            },
            HdpA: function (hdp) { //计算客队让球hdp
                return w.HandleData.HdpA(hdp);
            },
            BetItem: function (matchid, maketid, index, betpos) {//投注列
                return "{0}-{1}-{2}-{3}".format(matchid, maketid, index, betpos);
            },
            //联赛时间
            MatchDate: function (date) {
                var month = date.substr(4, 2);
                var mdate = date.substr(6, 2);
                var mhour = date.substr(8, 2);
                var mmiute = date.substr(10, 2);
                return "{0}/{1} {2}:{3}".format(month, mdate, mhour, mmiute)
            },
            OddChange: function (matchid, maketid, index, oddindex) {
                var key = "{0}-{1}-{2}-{3}".format(matchid, maketid, index, oddindex);
                if (this.changelist.hasOwnProperty(key)) return this.changelist[key];
                return 0;
            },
            //切换显示比赛
            ChangeShow: function (match) {
                if (match.hasOwnProperty("show")) {
                    match.show = !match.show;
                } else {
                    this.$set(match, "show", true);
                }

            },
            //点击选择比赛
            AssmbleBet: function (betodd, betpos, couid, matchid, marketid) {
                if (betodd == 0) {
                    return;
                }
                if (this.betlist == null) {
                    this.betlist = new Array();
                }
                this.selectBetitem = "{0}-{1}-{2}-{3}".format(matchid, marketid, 0, betpos);
                //重复点击消除
                var idx = this.selected.indexOf(this.selectBetitem);
                if (idx >= 0) {
                    this.selected.splice(idx, 1);
                    for (var j = 0; j < this.betlist.length; j++) {
                        if (this.betlist[j].matchId == matchid) {
                            this.betlist.splice(j, 1);
                            break;
                        }
                    }
                    return;
                }

                if (this.betlist.length >= 10) { //最多投注10局
                    w.vbus.$emit("ShowToast", "最多选择10场比赛,请取消一些选择后再试");
                    return;
                }


                var length = this.betlist.length;
                var params = {
                    betOdds: betodd,
                    betPos: betpos,
                    couid: couid,
                    matchId: matchid,
                    marketId: marketid
                }
                for (var i = 0; i < length; i++) {
                    if (this.betlist[i].matchId == params.matchId) {
                        this.betlist[i] = params;
                        this.selected.splice(i, 1);
                        this.selected.splice(i, 0, this.selectBetitem);
                        return;
                    }
                }
                this.betlist.push(params);
                this.selected.push(this.selectBetitem);
            },
            IsSelected: function (sid) {
                return this.selected.indexOf(sid) >= 0;
            },
            //点击按钮打开投注界面
            InitBet: function () {
                if (this.betlist == null || this.betlist.length < 2) {
                    //提示不能少于多少比赛
                    return;
                }
                var params = {
                    mixBets: encodeURI(JSON.stringify(this.betlist)),
                    mpId: w.$config.MpIDs[this.betlist.length - 2]
                }
                //this.betlist = [];
                //this.selected = [];
                this.$emit("InitBet", true, params);
            },
            //获取注单错误
            GetMixBetError: function () {
                //this.betlist = [];
                //this.selected = [];
            },
            //刷新盘口数据
            ReashData: function () {
                var gu = this;
                this.timer = setTimeout(function () {
                    gu.GetOdd(true, function (data) {
                        if (gu.type != "mix") {
                            return;
                        }
                        gu.CompareChange(data);
                        gu.ReashData();
                        gu = null;
                    });
                }, w.$config.RefreshTime.GuessMix);
            },
            //获取盘口变更
            CompareChange: function (newdata) {
                try {
                    this.changelist = w.HandleData.CompareChange(this.matchlist, newdata);
                } catch (e) {
                    this.changelist = {};
                    console.error("CompareChange " + e);
                }


            },
            HasOwnProperty: function (object, key) {
                if (object == null) {
                    return false;
                }
                if (object.hasOwnProperty(key)) {
                    return true;
                }
                return false;
            },
            IsEmptyObj: function (obj) {
                return w.HandleData.IsEmptyObj(obj);
            },
            DestoryTimer: function () {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                    this.type = "stopped";
                }
            }
        }
    })
    return mix;
});