/*
 * 投注记录
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['betlist'] = fun(w);
})(window, function (w) {
    var listhtml = '<div id="betspage"><div id="betlist-tabs">\
                    <span @click="ShowPage(\'unbal\')" :class="{\'tab\':true,\'tabselected\':type==\'unbal\'}"><span class="tab_text">未结算</span></span>\
                    <span @click="ShowPage(\'baldate\')" :class="{\'tab\':true,\'tabselected\':type!==\'unbal\'}"><span class="tab_text">已结算</span></span>\
                    </div>\
                    <div class="betlist xscroll">\
                <div  v-show="(type==\'balbets\'||type==\'unbal\')&&betlists.length>0" >\
                <div class="betlistpane"  v-for="(item,index) in betlists" >\
    	            <div class="listinfo">\
						<div class="leftdiv">\
						<span class="block textindent span1"><span class="betid">ID:{{item.BetID}}</span><span class="floatright block span2">{{item.BetDate}}</span><i v-show="type==\'unbal\' && item.Items[0].BetKind.indexOf(\'半场\') == -1" @click = "ShowConfirm(item)" class="pubicon block floatright"></i></span>\
                        <div class="subbets">\
                        <div v-for="subbet in item.Items" class="subbet-item">\
						    <div class="subbet_pos">\
								<div :class="\'bet_leftpane textCut inlineblock span3 blue \'+(subbet.Stage==3?\'livetext\':\' \')"><p class="l1"><span :class="subbet.Stage==3?\'livetext\':\'\'">{{subbet.Stage==3?"滚球":"赛前"}}</span>.{{MarketName(subbet)}}&nbsp;{{subbet.Score}}</p>\
								<p class="l2">{{BetTeam(subbet)}} {{ShowHdp(subbet.HDP,subbet.BetPos,subbet.MarketID)}}@{{subbet.Odds}}</p>\
								</div>\
								<div class="bet_rightpane" :style="\'color:\'+GetColor(subbet.BetStatus)">{{subbet.BetStatus}}\
                            </div>\
                        </div>\
                        <div class="subbet_info"><div class="lp">{{subbet.HomeName}} <span class="betlist_vs">{{GetBetScoreOrVS(subbet)}}</span> {{subbet.AwayName}}</div><span class="subbet_date">{{subbet.LeagueName}}{{zwsp}}@{{subbet.ReportDate}}</span></div>\
                        <div class="subbet_line"></div>\
                        </div>\
                        </div>\
                        <div class="bet_footer">\
                            <span class="floatleft betv">投注猜豆:{{item.BetValue}}</span>\
                            <span class="name inlineblock" style="margin:auto">{{item.MpName?item.MpName+"@"+item.BetOdds.toFixed(2):""}}</span>\
                            <span class="backvalue floatright textCut">{{type=="unbal"?"预计返还":"返还"}}: {{parseInt(type=="unbal"?(item.AllWin+item.AllLose):item.BackValue)}}</span>\
						</div>\
					</div>\
				</div>\
	            </div>\
	            </div>\
				<div v-show="type==\'baldate\'&&datelist.length>0" class="datelist">\
                <div  class="datelistpane" v-for="(item,index) in datelist" >\
                    <div   @click="ShowPage(\'balbets\',item.Date)"><span class="date_date">{{item.Date}}</span><span :class="\'date_count \'+(item.Count<=0?\'count_minus\':\'count_plus\')">{{item.Count}}<span class="date_arrow">&nbsp;</span></span></div>\
                </div>\
			  </div><div class="no-data-tips" v-show="nodata&&!isLoading">暂无数据</div>\
			  <loading v-if="isLoading" :loadingText=loadingText></loading></div>\
			  <confirmpub v-if = "isShowCon" @CloseMessagePub=CloseMessagePub @ConfirmPub=ConfirmPub :publishList = publishList></confirmpub>\
			  <successpub v-if = "isShowSuc" @CloseMessagePub=CloseMessagePub></successpub>\
			  <messagepub v-if = "isShowMsg" @CloseMessagePub=CloseMessagePub :errMsg = errMsg></messagepub>\
			  </div>';
    var BetColor = {
        "已接受": "rgb(17,96,162)",
        "等待": "rgb(17,96,162)",
        "拒绝": "#808080",
        "取消": "#333333",
        "赢": "#d90000",
        "赢半": "#d90000",
        "输": "#1eb900",
        "输半": "#1eb900",
        "走盘": "#3a66b3"
    }
    var list = Vue.extend({
        template: listhtml,
        name: "betlist",
        data: function () {
            var type = this.$route.params.type;
            var date = this.$route.params.date;
            return {
                isLoading: true,
                datelist: [],
                reportDate: "",
                //showbalanced: false,
                //showdatelist: false,
                betlists: [],
                zwsp: String.fromCharCode(8203),//零宽度空格 用于分隔连在一起但实际并不是一个整体词的两个词
                type: type,  // unbal baldate balbets
                date: date,
                isShowCon:false,
                isShowSuc:false,
                isShowMsg:false,
                publishList:null,
                loadingText: "", //加载显示文字
                errMsg:""//发布失败提示
            }
        },
        computed: {
            nodata: function () {
                return ((this.type == "unbal" || this.type == "balbet") && this.betlists.length == 0) || (this.type == "baldate" && this.datelist.length == 0);
            }
        },
        components: {
            //模组
            loading: w.component.loading,
            confirmpub:w.component.confirmpub,
            successpub:w.component.successpub,
            messagepub:w.component.messagepub
            

        },
        created: function () {
            this.ShowPage(this.type, this.date);
            vbus.$emit("SetTitle", "注单列表");
        },
        watch: {
            '$route': function (to, from) {
                this.type = this.$route.params.type;
                this.date = this.$route.params.date;
            }
        },
        methods: {
        	   ConfirmPub: function (id) {       	  	
                var that = this;
                this.ShowLoading("发布中...");
                that.isShowCon = 0;
                var params = {BetID:id}     //请求唯一参数注单ID
                w.Api.PublishBet(params, function (data) {
                	  that.isLoading = false;
                	  
                      var msg = data.Result;
                      if(msg == 1){
                      	that.isShowSuc = true;
                      	return
                      }else{
                      	var text = w.$config.PublishMsg[msg];                      
                      	that.errMsg = text;
                      	that.isShowMsg = true;
                        console.log(msg+"====="+text);
                      }
                      
                }, function (err) {
                      console.log(err);
                });
            },
            //显示加载按钮
            ShowLoading: function (text) {
            	console.log(text);
                this.isLoading = true;
                this.loadingText = text;
            },
        	InitPublish: function (item,index){
        		alert('初始化发布');
        	},
            MarketName: function (subbet) {
                return w.$config.MarketName[subbet.MarketID] || subbet.BetKind;

            },
            BetTeam: function (subbet) {
                if (subbet.BetTeam == "主") {
                    return subbet.HomeName;
                }
                if (subbet.BetTeam == "客") {
                    return subbet.AwayName;
                }
                return subbet.BetTeam;
            },
            ShowHdp: function (hdp, pos, market) {
                return w.HandleData.showHDP(hdp, pos, market);
            },
            ShowPage: function (type, date) {
                switch (type) {
                    case "baldate":
                        this.type = type;
                        this.$router.push({ name: "betlist", params: { type: type, date: "_" } });
                        this.GetBalancedBetDate();
                        break;
                    case "balbets":
                        this.type = type;
                        this.$router.push({ name: "betlist", params: { type: type, date: date.replace(/\//g, "-") } });
                        this.GetBalancedBets(date);
                        break;
                    case "unbal":
                    default:
                        this.type = type;
                        this.$router.push({ name: "betlist", params: { type: type, date: "_" } });
                        this.GetUnbalancedBets();
                }
            },
            GetBetScoreOrVS: function (subbet) {
                if (subbet.IsHalfMarket) {
                    return "<" + subbet.HalfScore + ">";
                }
                return "<" + subbet.FullScore + ">";
            },
            //未结算
            GetUnbalancedBets: function () {
                var that = this;
                that.betlists = [];
                this.loadingText = "";
                that.isLoading = true;
                w.Api.GetUnbalancedBets(function (data) {
                    that.isLoading = false;
                    if (data.Success) {
                    	console.log(data.Data);
                        that.betlists = data.Data;

                    } else {
                        that.betlists = [];
                    }
                }, function () {
                    that.isLoading = false;
                    that.betlists = [];
                });
            },
            //已结算日期列表
            GetBalancedBetDate: function () {
            	this.loadingText = "";
                var that = this;
                that.datelist = [];
                that.isLoading = true;
                w.Api.GetBalancedBetDate(function (data) {
                    that.isLoading = false;
                    if (data.Success) {
                        that.datelist = data.Data;
                    } else {
                        that.datelist = [];
                    }
                }, function () {
                    that.isLoading = false;
                    that.datelist = [];
                });
            },
            //已结算注单列表
            GetBalancedBets: function (repDate) {
            	this.loadingText = "";
                this.isLoading = true;
                var that = this;
                that.betlists = [];
                that.showdatelist = false;
                w.Api.GetBalancedBets(repDate, function (data) {
                    that.isLoading = false;
                    if (data.Success) {
                        that.betlists = data.Data;
                    } else {
                        that.betlists = [];
                    }
                }, function () {
                    that.betlists = [];
                    that.isLoading = false;
                });
            },
            GetColor: function (status) {
                return BetColor[status] || "black";
            },
            //确认发布弹框
            ShowConfirm:function(item){
            	console.log(item);
            	this.publishList = item;
            	this.isShowCon = true;
            },
             //发布成功弹框
            ShowSuccessPub:function(){
            	this.isShowSuc = true;
            },
            //显示加载
            ShowLoad:function(bo){
            	this.isLoading = bo;
            },
            //发布失败弹框
            ShowFailPub:function(errMsg){
            	this.isShowMsg = true;
            	this.errMsg = errMsg;
            },
            //关闭消息提示框
            CloseMessagePub: function (flag) {
               switch (flag){
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
        }

    });
    return list;
});