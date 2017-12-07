/*
 * 投注界面
 * 在guess和match页面有调用
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['betpane'] = fun(w);
})(window, function (w) {
    var bethtml = '<div class="shadow">\
					<div class="betpane">\
					<div class="title"><i class="floatleft block wgicon icon_balance_bet"></i><span class=\"yellow\">{{Fmoney(balance)}}</span><i class="floatright block wgicon icon_close"  @click="CloseBetPane()"></i>\
					</div>\
					<div class="betmatchlist">\
						<div v-for="(match,index) in matchlist">\
							<div class="infoleft textindent">\
	                            <span class="event">\
		                            <span class="back textCut l1c1">{{match.Stage==3?"滚球":"赛前"}}.{{MarketName(match)}}:{{match.BetTeam}} {{showHDP(match.Hdp,match.BetPos,match.MarketID)}}</span>\
		                            <span class="yellow l1c2"> @ {{match.NewOdds}}</span>\
		                            <i :class="{\'arrow\':true,\'oddup\':(OddChange(match.OldOdds,match.NewOdds)==1),\'odddown\':(OddChange(match.OldOdds,match.NewOdds)==2)}"></i>\
		                            <i class="wgicon l1c4" :class="{\'icon_closeitem\':isMix}" @click="RemoveMatch(index)"></i>\
	                            </span>\
                            </div>\
                            <div class="inforight">\
		                            <span class="textindent textCut l2c1">{{match.HomeName}} vs {{match.AwayName}}</span>\
		                            <span class="textindent textCut l2c2">	{{match.LeagueName}}@{{ReportDate(match.ReportDate)}}<span style="display:inline-block;width:8px"></span></span>\
                            </div>\
						</div>\
					</div>\
					<div  class="computed textindent"><span v-if="isMix" >{{betinfo.TicketList.length}}X1 赔率  </span><span v-if="isMix"  class="yellow">{{betinfo.MixTotalOdds.toFixed(2)}}</span>\
					<span v-if="!isMix" > 赔率  </span><span v-if="!isMix" class="yellow">{{betinfo.Ticket.NewOdds}}</span>\
					<span class="totalback">预计返豆   <span class="yellow">{{totalBack}}</span></span></div>\
					<div class="moneyitem"><input  id="betmoney" class="money back" type="number" min="1" v-model="betMoney" placeholder="请输入猜豆数量"/> <a class="white" @click="SubmitBet()">确定</a></div>\
					<div class="fastBetBtn"><a v-for="(limit,index) in limitList" @click="FastBet(limit)">{{limit}}</a></div>\
					<div class="computed textindent"><span>最低投注:{{Fmoney(betinfo.Limit.MinBet)}}</span><span class="maxlimit">最高投注:{{Fmoney(betinfo.Limit.MaxBet)}}</span></div>\
				</div>\
				</div>';
    var bet = Vue.extend({
        template: bethtml,
        props: ['isMix', 'betinfo'],
        data: function () {
            return {
                balance: w.Api.Balance, //在点击投注时需要重新获取余额
                betMoney: "", //投注额
                limitList: ['100', '200', '500', '1000', '5000'], //固定投注筹码按钮
                scrollTop:0
            }
        },
        created: function () {
            var that = this;
            //that.scrollTop = document.getElementById("match").scrollTop;
            //document.getElementById("match").style.overflowY = "hidden";
            w.vbus.$on("BalanceUpdated", function (v) {
                that.balance = v;
            });
        },
        destroyed: function () {
            //document.getElementById("match").style.overflowY = "scroll";
            //document.getElementById("match").scrollTop = this.scrollTop;
        },
        computed: { //计算属性
            //总赔率
            matchlist: function () {
                if (this.betinfo == null) {
                    return [];
                }
                if (this.isMix) {
                    return this.betinfo.TicketList;
                }
                var arr = [];
                arr.push(this.betinfo.Ticket);
                return arr;
            },
            //预计返还
            totalBack: function () {
                if (this.betMoney == "" || this.betMoney == null) {
                    return 0;
                }
                var sum = 0;
                if (this.isMix) {
                    sum = (parseFloat(this.betinfo.MixTotalOdds) * parseFloat(this.betMoney));
                } else {
                    sum = (parseFloat(this.betinfo.Ticket.NewOdds) * parseFloat(this.betMoney));
                }
                return this.Fmoney(sum);
            }
        },
        methods: {
            MarketName: function (m) {
                return w.$config.MarketName[m.MarketID] || m.BetKind;
            },
            showHDP: function (hdp, pos, market) {
                return w.HandleData.showHDP(hdp, pos, market);
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
            ReportDate: function (date) {
                return date.split("T")[0].replace(/-/g, "/");
            },
            OddChange: function (oldodd, newodd) {
                if (oldodd < newodd) {
                    return 1; //上涨
                } else if (oldodd > newodd) {
                    return 2; //下降
                }
                return 0; //不变
            },
            //关闭投注
            CloseBetPane: function () {
                this.$emit("CloseBetPane");
                w.vbus.$emit("CloseBetPane");
            },
            //移除比赛
            RemoveMatch: function (index) {
                var r = this.matchlist.splice(index, 1);
                if (this.isMix && this.matchlist.length < 2) {
                    this.$emit("CloseBetPane");
                    w.vbus.$emit("CloseBetPane");
                }
                w.vbus.$emit("removeMatch", r[0], index);
            },
            //快速投注
            FastBet: function (limit) {
                this.betMoney = limit;
                //w.document.getElementById("betmoney").value = limit;
            },
            //提交投注
            SubmitBet: function () {
                var params;
                if (this.betMoney == "" || isNaN(this.betMoney)) {
                    this.betMoney = this.betinfo.Limit.MinBet;
                    return;
                }
                if (this.betMoney < this.betinfo.Limit.MinBet) {
                    this.betMoney = this.betinfo.Limit.MinBet;
                    return;
                }
                if (this.betMoney > this.betinfo.Limit.MaxBet) {
                    this.betMoney = this.betinfo.Limit.MaxBet;
                    return;
                }
                if (this.isMix) { //混合过关投注
                    if (this.betinfo.TicketList.length < 2) {
                        return;
                    }
                    var arr = [];
                    for (var i = 0; i < this.betinfo.TicketList.length; i++) {
                        var item = this.betinfo.TicketList[i];
                        var jsondata = {
                            CouID: item.CouID,
                            MatchID: item.MatchID,
                            MarketID: item.MarketID,
                            Odds: item.NewOdds,
                            BetPos: item.BetPos,
                            BetHdp: item.BetHdp
                        }
                        arr.push(jsondata);
                        item = null;
                        jsondata = null;
                    }
                    params = {
                        BetValue: this.betMoney,
                        MpID: w.$config.MpIDs[arr.length - 2],
                        MixInfo: JSON.stringify(arr)
                    }
                } else { //一般投注
                    params = {
                        CouID: this.betinfo.Ticket.CouID,
                        MatchID: this.betinfo.Ticket.MatchID,
                        MarketID: this.betinfo.Ticket.MarketID,
                        Odds: this.betinfo.Ticket.NewOdds,
                        BetPos: this.betinfo.Ticket.BetPos,
                        BetHdp: this.betinfo.Ticket.BetHdp,
                        BetValue: this.betMoney,
                        SportID: this.betinfo.Ticket.SportID,
                        Stage: this.betinfo.Ticket.Stage,
                    }
                }
                this.$emit("SubmitBet", params);
            },
            //格式化猜豆数据
            Fmoney: function (n) {
                if (n == undefined) {
                    return "undefined";
                }
                return n.toString().fmoney();
            }
        }
    })
    return bet;
});