(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['guessPage'] = fun(w);
})(window, function (w) {
    var guesshtml = '<div class="guess_dpane">\
			<guessheader :type=type :sportId=sportId  ref="bar"  @ChangeType=ChangeType @ChangeSport=ChangeSport @ShowStatement=ShowStatement @ShowRanking=ShowRanking></guessheader>\
            <div v-if="(type==\'time\') || (type==\'league\') " class="guesspane">\
					<div :class="\'leftpane \'+(showleftpane?\'\':\'lefthide\')">\
						<timeitem :xtype=type :sportId=sportId v-if="(type==\'time\') "   @ChangeTime=ChangeTime  @ComputedHeight=ComputedHeight></timeitem>\
						<leagueitem :xtype=type :sportId=sportId  v-if="(type==\'league\') "   @ChangeLeague=ChangeLeague  @ComputedHeight=ComputedHeight></timeitem>\
					</div>\
    				<div class="rightpane xscroll" >\
						<matchitem :showleftpane=showleftpane :matchlist=matchlist :type=type @SelectMatch=SelectMatch> </matchitem>\
					</div>\
			</div>\
				<live :xtype=type v-if="(type==\'live\')" :sportId=sportId :isShowBet=isShowBet :selectBetitem=selectBetitem @InitBet=InitBet @SelectMatch=SelectMatch @ComputedHeight=ComputedHeight ></live>\
				<mix class="guesspane" :xtype=type v-if="(type==\'mix\')" ref="mix" :sportId=sportId :isShowBet=isShowBet :selectBetitem=selectBetitem @InitBet=InitBet @ComputedHeight=ComputedHeight ></mix>\
				<betpane v-if="isShowBet" :isMix=isMix :betinfo=betinfo  @CloseBetPane=CloseBetPane @SubmitBet=SubmitBet></betpane>\
				<betfail :type=isBetSuccess :betErrormsg=betErrormsg v-show="isBetSuccess==2 || isBetSuccess==3" @CloseMessage=CloseMessage @ReSubmitBet=ReSubmitBet @CancelBet=CancelBet></betfail>\
				<betsuccess :betResult=betResult  v-if="isBetSuccess==1" @ConfirmPub=ConfirmPub  @CloseMessage=CloseMessage @ShowSuccessPub=ShowSuccessPub @ShowFailPub=ShowFailPub @ShowLoading=ShowLoading></betsuccess>\
				<successpub v-if = "isShowSuc" @CloseMessagePub=CloseMessagePub></successpub>\
			    <messagepub v-if = "isShowMsg" @CloseMessagePub=CloseMessagePub :errMsg = errMsg></messagepub>\
				<loading v-show="isLoading" :loadingText=loadingText></loading></div>';
    var guess = Vue.extend({
        template: guesshtml,
        name: "guess",
        data: function () {
            var gsportid = 1;
            var gtype = "time";
            if (this.$route.params.sportId) {
                gsportid = this.$route.params.sportId;
            }
            if (this.$route.params.type) {
                gtype = this.$route.params.type;
            }
            return {
                currentmatchs: {},
                currentgames: {},
                sportId: gsportid,
                type: gtype, //按日期,按联赛,滚球，串关
                matchlist: [], //选中联赛
                isLoading: false, //是否显示加载动画
                loadingText: "", //加载显示文字
                selectBetitem: "", //投注选中
                betinfo: {}, //获取投注前数据
                isShowBet: false, //是否显示投注界面
                isMix: false, //是否为混合过关投注
                isBetSuccess: 0, //是否投注成功0未投注,1投注成功,2投注失败,3投注失败提示重投
                betResult: null, //投注成功结果
                betParams: null, //投注参数(记录上次投注参数用于重新投注)
                betErrormsg: "", //投注失败原因
                showleftpane: true,
                isShowSuc: false,//发布成功
                isShowMsg: false,//发布失败
                errMsg: "",//发布失败信息详情
            }
        },
        watch: {
            '$route': function (to, from) {
                this.type = this.$route.params.type;
                this.sportId = this.$route.params.sportId;
            }
        },
        components: {
            //模组
            guessheader: w.component.guessheader,
            timeitem: w.component.timeitem,
            leagueitem: w.component.leagueitem,
            matchitem: w.component.matchitem,
            live: w.component.live,
            mix: w.component.mix,
            loading: w.component.loading,
            betpane: w.component.betpane,
            betsuccess: w.component.betsuccess,
            betfail: w.component.betfail,
            successpub: w.component.successpub,
            messagepub: w.component.messagepub,

        },
        mounted: function () { //初始化
            this.ComputedHeight();
            vbus.$emit("SetTitle", "竞猜");

        },
        methods: {
        	ConfirmPub: function (id) {
                var that = this;
                this.ShowLoading("发布中...");
                that.isBetSuccess = 0;
                var params = { BetID: id }     //请求唯一参数注单ID
                w.Api.PublishBet(params, function (data) {
                    that.isLoading = false;

                    var msg = data.Result;
                    if (msg == 1) {
                        that.isShowSuc = true;
                        return
                    } else {
                        var text = w.$config.PublishMsg[msg];
                        that.errMsg = text;
                        that.isShowMsg = true;
                        console.log(msg + "=====" + text);
                    }

                }, function (err) {
                    console.log(err);
                });
            },
            //发布成功弹框
            ShowSuccessPub: function () {
                this.isLoading = false;
                this.isShowSuc = true;

            },
            //发布失败弹框
            ShowFailPub: function (errMsg) {
                this.isLoading = false;
                console.log("father");
                this.isShowMsg = true;
                this.errMsg = errMsg;
            },
            //关闭消息提示框
            CloseMessagePub: function (flag) {
                switch (flag) {
                    case 0://确认发布
                        this.isShowCon = false
                        break;
                    case 1://发布成功
                        this.isShowSuc = false
                        break;
                    case 2://消息提示
                        this.isShowMsg = false
                        break;
                    default:
                        return;

                }
            },
            UpdateBalance: function () {
                w.vbus.$emit("UpdateBalance");
            },
            //变更体育类型
            ChangeSport: function (sportId) {
                this.isShowBet = false;
                this.sportId = sportId;
                this.$router.push({ name: "guess", params: { sportId: sportId } });
            },
            //变更显示类型
            ChangeType: function (type) {
                if (this.type == type) {
                    return;
                } else {
                    this.matchlist = [];
                    this.isShowBet = false;
                    this.type = type;
                    try {
                        this.$router.push({ name: "guess", params: { type: type } });
                    } catch (e) {
                        var x = e;
                    }
  



                }
            },
            EmptyData: function (hideleft) {
                if (hideleft) {
                    this.showleftpane = false;
                } else {
                    this.showleftpane = true;
                }
            },
            //按时间中选择具体时间
            ChangeTime: function (matchlist) {
                if (this.matchlist == matchlist) {
                    return;
                }
                this.matchlist = matchlist;
                this.EmptyData(matchlist.length == 0);
            },
            //按联赛中选择具体联赛
            ChangeLeague: function (matchlist) {
                if (this.matchlist == matchlist) {
                    return;
                }
                this.matchlist = matchlist;
                this.EmptyData(matchlist.length == 0);
            },
            //比赛列表中进入具体比赛
            SelectMatch: function (matchId) {
  
                this.$router.push({
                    name: 'match',
                    params: {
                        matchId: matchId,
                        marketid: 0,
                        betpos:0
                    }
                });
            },
            //计算guess高度
            ComputedHeight: function () {


            },
            //请求投注
            InitBet: function (type, parma) {
                this.UpdateBalance();
                this.isMix = type;
                var gu = this;
                this.ShowLoading(w.Language.LoadingText.LoadGetBet);
                if (this.isMix) {
                    w.Api.GetMixBet(parma, function (data) {
                        gu.isLoading = false;
                        switch (data.RequestBetError) {
                            case w.$config.RequestBetError.Success:
                            case w.$config.RequestBetError.OddChange:
                            case w.$config.RequestBetError.OutLeveChanged:
                                if (data.RequestBetError == 1) {
                                    //odds变化
                                    w.vbus.$emit("ShowToast", "赔率变化为" + data.Data.MixTotalOdds);
                                }
                                if (data.Data) {
                                    gu.betinfo = data.Data;
                                    gu.isShowBet = true;
                                }
                                break;
                            case w.$config.RequestBetError.TicketError:
                            case w.$config.RequestBetError.LimitError:
                            case w.$config.RequestBetError.SystemError:
                            case w.$config.RequestBetError.OverLimit:
                            case w.$config.RequestBetError.MixParamNotFind:
                            case w.$config.RequestBetError.NeedLogin:
                                gu.$refs.mix.GetMixBetError(); //清空投注列表
                                console.log("获取投注失败:" + data.ErrorMsg);
                                w.vbus.$emit("ShowToast", "请求串关注单失败,请重试或者刷新页面.", 3000);
                                break;

                        }
                    }, function (err) {
                        gu.isLoading = false;
                        console.log("err=" + err.Message); //提示错误
                    });
                } else {
                    w.Api.GetBet(parma, function (data) {
                        gu.isLoading = false;
                        switch (data.RequestBetError) {
                            case w.$config.RequestBetError.Success:
                            case w.$config.RequestBetError.OddChange:
                            case w.$config.RequestBetError.OutLeveChanged:
                                if (data.RequestBetError == 1) {
                                    //odds变化
                                    w.vbus.$emit("ShowToast", "赔率已从{OldOdds}变化为{NewOdds}".format(data.Data.Ticket), 2000);
                                }
                                if (data.Data) {
                                    gu.betinfo = data.Data;
                                    gu.isShowBet = true;
                                }
                                break;
                            case w.$config.RequestBetError.TicketError:
                            case w.$config.RequestBetError.LimitError:
                            case w.$config.RequestBetError.SystemError:
                            case w.$config.RequestBetError.OverLimit:
                            case w.$config.RequestBetError.MixParamNotFind:
                            case w.$config.RequestBetError.NeedLogin:
                                console.log("获取投注失败:" + data.ErrorMsg);
                                w.vbus.$emit("ShowToast", "请求注单失败,请重试或者刷新页面.", 3000);
                                break;
                        }
                    }, function (err) {
                        gu.isLoading = false;
                        console.log("获取投注错误:" + err.Message); //提示错误
                        w.vbus.$emit("ShowToast", "请求注单失败,请重试或者刷新页面.", 3000);
                    });
                }
            },
            //提交投注 混合过关 滚球
            SubmitBet: function (params) {
                this.betParams = params;
                this.isShowBet = false;
                //显示loading;
                this.ShowLoading(w.Language.LoadingText.LoadBet);
                var gu = this;
                if (gu.isMix) { //混合投注;
                    w.Api.BetMix(params, function (data) {
                        gu.UpdateBalance();
                        gu.isLoading = false;
                        gu.selectBetitem = "";
                        if (data.BetResult === 0) {

                            gu.isBetSuccess = 1;
                            gu.betResult = data.Data;
                            gu.betParams = null;
                            w.vbus.$emit("MixBetSuccess");

                        }
                        else if (data.BetResult === 2 || data.BetResult === 3) {
                            var y = confirm("串关赔率已变化,是否继续投注?");
                            if (y) {
                                //赔率变化 重新请求
                                w.vbus.$emit("ReInitMixBet");
                                //if (gu.betParams && gu.betParams.hasOwnProperty("MixInfo")) {
                                //    var arr = JSON.parse(gu.betParams.MixInfo);
                                //    for (var i = 0; i < arr.length; i++) {
                                //        arr[i].Odds = data.ChangedMix.MixBets[arr[i].CouID]["NewOdds"];
                                //        arr[i].BetHdp = data.ChangedMix.MixBets[arr[i].CouID]["BetHdp"];
                                //    }
                                //    gu.betParams.MixInfo = JSON.stringify(arr);
                                //}
                                //gu.isShowBet = true;
                            }
                        } else {
                            //操作失败
                            console.log(data);
                            switch (data.BetResult) {
                                //暂无继续投注功能
                                //case w.$config.BetResultEnum.HdpChanged:
                                //case w.$config.BetResultEnum.OddsChanged:
                                //    //提示是否继续投注
                                //    if (gu.betParams && gu.betParams.hasOwnProperty("MixInfo")) {
                                //        var arr = JSON.parse(gu.betParams.MixInfo);
                                //        for (var i = 0; i < arr.length; i++) {
                                //            arr[i].Odds = data.Data.MixBets[arr[i].CouID].NewOdds;
                                //            arr[i].BetHdp = data.Data.MixBets[arr[i].CouID].BetHdp;
                                //        }
                                //        gu.betParams.MixInfo = JSON.stringify(arr);
                                //    }
                                //    gu.isBetSuccess = 3;
                                //    gu.betErrormsg = data.ErrorMsg;
                                //    break;
                                default:
                                    gu.isBetSuccess = 2; //投注失败
                                    gu.betErrormsg = data.ErrorMsg;
                                    gu.betParams = null;
                                    break;
                            }
                            w.vbus.$emit("MixBetFail");
                        }
                    }, function (err) {
                        gu.UpdateBalance();
                        gu.selectBetitem = "";
                        gu.isLoading = false;
                        console.log("err=" + err.Message); //提示错误
                    });
                } else {
                    w.Api.Bet(params, function (data) {
                        gu.UpdateBalance();
                        gu.isLoading = false;
                        gu.selectBetitem = "";
                        if (data.BetResult === 0) {

                            gu.isBetSuccess = 1;
                            gu.betResult = data.Data;
                            gu.betParams = null;

                        }
                            //hdp odds 变化
                        else if (data.BetResult === 2 || data.BetResult === 3) {
                            gu.betParams.Odds = data.Changed.NewOdds;
                            gu.betParams.BetHdp = data.Changed.NewHdp;
                            gu.betinfo.Ticket.NewOdds = data.Changed.NewOdds;
                            //gu.betinfo.Ticket.BetHdp = data.Changed.NewHdp;
                            var str = "";
                            if (data.Changed.NewOdds != data.Changed.OldOdds) {
                                str += "赔率已从{0}变化为{1} ".format(data.Changed.OldOdds, data.Changed.NewOdds);
                            }
                            if (data.Changed.NewHdp != data.Changed.OldHdp) {
                                str += "球头已从{0}变化为{1} ".format(data.Changed.OldHdp, data.Changed.NewHdp);
                            }
                            str += "是否继续投注?";
                            var y = confirm(str);
                            if (y) {
                                gu.isShowBet = true;
                            } else {

                            }

                        } else {
                            //操作失败
                            console.log(data);
                            //switch (data.Data.Result) {
                            //暂无继续投注功能
                            //case w.$config.BetResultEnum.HdpChanged:
                            //case w.$config.BetResultEnum.OddsChanged:
                            //    //提示是否继续投注
                            //    if (gu.betParams) {
                            //        gu.betParams.Odds = data.Data.BetInfo.NewOdds;
                            //        gu.betParams.BetHdp = data.Data.BetInfo.BetHdp;
                            //    }
                            //    gu.isBetSuccess = 3;
                            //    gu.betErrormsg = data.ErrorMsg;
                            //    break;
                            // default:
                            gu.isBetSuccess = 2; //投注失败
                            gu.betErrormsg = data.ErrorMsg;
                            gu.betParams = null;
                            // break;
                            // }
                        }
                    }, function (err) {
                        gu.UpdateBalance();
                        gu.selectBetitem = "";
                        gu.isLoading = false;
                        console.log("err=" + err.Message); //提示错误
                    });
                }

            },
            //重新投注
            ReSubmitBet: function () {
                this.CloseMessage();
                this.SubmitBet(this.betParams);
            },
            //取消重投
            CancelBet: function () {
                this.CloseMessage();
                this.betParams = null;
            },
            //关闭投注界面
            CloseBetPane: function () {
                //是否清除已选投注比赛
                this.selectBetitem = "";
                this.isShowBet = false;
            },
            //关闭提示框
            CloseMessage: function () {
                this.isBetSuccess = 0;
            },
            //显示加载动画
            ShowLoading: function (text) {
                this.isLoading = true;
                this.loadingText = text;
            },
            //显示投注记录
            ShowStatement: function () {
                this.$router.push({
                    name: "betlist",
                    params: { type: "unbal", date: "0" }
                });
            },
            //显示排行榜
            ShowRanking: function () {
                this.$router.push({
                    name: "ranking"
                });
            }
        }
    });
    return guess;
});