/*
 * 详细比赛
 * 传入参数为滚球的比赛列表
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['live'] = fun(w);
})(window, function (w) {
    var livehtml = '<div id="matchitem"  class="live guesspane xscroll" :class="{\'scrollpane\':!isShowBet}">\
					<div><div v-for="(match,index) in matchlist.MH" class="item" >\
						<div class="title\" style="overflow:hidden"><span class="textCut textindent">{{matchlist.LG[match.M[2]].LN}}</span><span class="type">全场让球</span><span class="type">全场大小</span></div>\
						<div class="pane" style="overflow:hidden">\
								<a class="info" style=\"overflow:hidden\" @click="SelectMatch(match.MatchID)">\
									<span class="block textindent line1"><span class="name textCut">{{match.M[4]}}</span><span :class="\'card \'+(match.ML[4]==0?\'zero\':\'\')">{{match.ML[4]}}</span><span class=\"score\">{{match.ML[2]}}</span></span>\
									<span class="block textindent line2"><span class="livetime">{{GetLiveTime(match.ML[0],match.ML[1])}}</span><span class="guesserCount"><i class="wgicon person"></i><span class="count">200</span><i class="wgicon rightarrow"></i></span></span>\
									<span class="block textindent line3"><span class="name textCut">{{match.M[6]}}</span><span :class="\'card \'+(match.ML[5]==0?\'zero\':\'\')">{{match.ML[5]}}</span><span class="score">{{match.ML[3]}}</span></span>\
								</a>\
								<div class="odds" >\
									<a class="block" :class="{\'selectBet\':(selectBetitem==BetItem(match.MatchID,1,0,1))}" >\
									<span class="wrapper" v-if="HasOwnProperty(match.MK,\'1\')" @click="InitBet(match.MK[\'1\'][0][1],1,match.MK[\'1\'][0][0],match.MatchID,1)"><span class="hdp textCut" >{{HdpH(match.MK["1"][0][3])}}</span>\
									<span class="odd yellow textCut">{{FO(match.MK["1"][0][1])}}<i :class="{\'oddup\':(OddChange(match.MatchID,1,0,1)==1),\'odddown\':(OddChange(match.MatchID,1,0,1)==2)}"></i></span>\
									</span></a>\
									<a class="block" :class="{\'selectBet\':(selectBetitem==BetItem(match.MatchID,1,0,2))}" >\
									<span class="wrapper" v-if="HasOwnProperty(match.MK,\'1\')" @click="InitBet(match.MK[\'1\'][0][2],2,match.MK[\'1\'][0][0],match.MatchID,1)"><span class="hdp textCut" >{{HdpA(match.MK["1"][0][3])}}</span>\
									<span class="odd yellow textCut">{{FO(match.MK["1"][0][2])}}<i :class="{\'oddup\':((OddChange(match.MatchID,1,0,2))==1),\'odddown\':(OddChange(match.MatchID,1,0,2)==2)}"></i></span>\
									</span></a>\
								</div>\
								<div class="odds">\
									<a class="block" :class="{\'selectBet\':(selectBetitem==BetItem(match.MatchID,3,0,1))}"  >\
									<span class="wrapper" v-if="HasOwnProperty(match.MK,\'3\')" @click="InitBet(match.MK[\'3\'][0][1],1,match.MK[\'3\'][0][0],match.MatchID,3)"><span class="hdp textCut">大{{Hdp(match.MK["3"][0][3])}}</span>\
									<span class="odd yellow textCut">{{FO(match.MK["3"][0][1])}}<i :class="{\'oddup\':(OddChange(match.MatchID,3,0,1)==1),\'odddown\':(OddChange(match.MatchID,3,0,1)==2)}"></i></span>\
									</span></a>\
									<a class="block" :class="{\'selectBet\':(selectBetitem==BetItem(match.MatchID,3,0,2))}"  >\
									<span class="wrapper"  v-if="HasOwnProperty(match.MK,\'3\')" @click="InitBet(match.MK[\'3\'][0][2],2,match.MK[\'3\'][0][0],match.MatchID,3)"><span class="hdp textCut">小{{Hdp(match.MK["3"][0][3])}}</span>\
									<span class="odd yellow textCut">{{FO(match.MK["3"][0][2])}}<i :class="{\'oddup\':(OddChange(match.MatchID,3,0,2)==1),\'odddown\':(OddChange(match.MatchID,3,0,2)==2)}"></i></span>\
									</span></a>\
								</div>\
						</div>\
					</div>\
					<div class="no-data-tips" v-show="matchlist.MH==null||matchlist.MH.length==0">暂无数据</div>\
					<loading v-show="isLoading"></loading></div>\
				</div>';
    var live = Vue.extend({
        template: livehtml,
        name: "live",
        props: ["sportId", "isShowBet", "selectBetitem", "xtype"],
        data: function () {
            return {
                timer: null, //刷新时钟
                updateTime: "", //上次更新时间
                matchlist: {},
                changelist: {}, //变化列表0不变,1上升,2下降
                isLoading: false,
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
            this.GetOdd(false);
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
            //获取盘口数据
            GetOdd: function (refresh, callback) {
                var gu = this;
                w.Api.GetOddsByLive({
                    SportId: this.sportId,
                    UpdateTime: this.updateTime
                }, function (data) {
                    gu.isLoading = false; //取消loading
                    if (data.Success) {
                        gu.updateTime = data.Data.T;
                        if (refresh) {
                            if (typeof (callback) == "function") callback(data.Data);
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
            BetItem: function (matchid, marketid, index, betpos) { //投注列
                return "{0}-{1}-{2}-{3}".format(matchid, marketid, index, betpos);
            },
            InitBet: function (betodd, betpos, couid, matchid, marketid) {
                if (betodd == 0) {
                    return;
                }
                this.selectBetitem = "{0}-{1}-{2}-{3}".format(matchid, marketid, 0, betpos);
                //投注参数未确定
                var params = {
                    betOdds: betodd,
                    betPos: betpos,
                    couid: couid,
                    matchId: matchid,
                    marketId: marketid
                }
                this.$emit("InitBet", false, params);
            },
            //计算赔率变更0:无变更,1上升,2下降
            OddChange: function (matchid, maketid, index, betpos) {
                var key = "{0}-{1}-{2}-{3}".format(matchid, maketid, index, betpos);
                if (this.changelist.hasOwnProperty(key)) return this.changelist[key];
                return 0;
            },
            //刷新盘口数据
            ReashData: function () {
                var gu = this;
                this.timer = setTimeout(function () {
                    if (gu.type != "live") {
                        return;
                    }
                    gu.GetOdd(true, function (data) {
                        if (gu.type != "live") {
                            return;
                        }
                        gu.CompareChange(data);
                        gu.ReashData();
                        gu = null;
                    });
                }, w.$config.RefreshTime.GuessLive);

            },
            //获取盘口变更
            CompareChange: function (newdata) {
                this.changelist = w.HandleData.CompareChange(this.matchlist, newdata);
            },
            //选中比赛
            SelectMatch: function (matchid) {
                this.$emit("SelectMatch", matchid);
            },
            HasOwnProperty: function (object, key) {
                if (object && object[key] && object[key].length != null && object[key].length == 0) {
                    return false;
                }
                if (object && object.hasOwnProperty(key) && object[key] != null) {
                    return true;
                }
                return false;
            },
            DestoryTimer: function () {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                    this.type = "stopped";
                }
            },
            GetLiveTime: function (phase, livetime) {
                return w.HandleData.ComputeLiveTime(+this.sportId, phase, livetime);
            }
        }
    });
    return live;
});