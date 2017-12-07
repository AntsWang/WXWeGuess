(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['betsuccess'] = fun(w);
})(window, function (w) {
   var successhtml = '<div class="shadow betsuccess">\
				<div class="successpane">\
					<div class="messagetitle yellow"><span>{{betResult.SubBets[0].Stage==3?"注单已提交成功,等待系统确认...":"投注成功"}}</span><i class="block wgicon icon_close" @click="CloseMessage()"> </i></div>\
					<div class="matchlist">\
						<div v-for="(match,index) in info.matchlist">\
							<div class="matchitem textindent"><span class="event"><span class="back">{{match.Stage==3?"滚球":"赛前"}}.{{MarketName(match)}}:{{match.BetPosName}} {{showHDP(match.Hdp,match.BetPos,match.MarketID)}}</span><span class="yellow"> @ {{match.Odds}}</span></span>\
							<span class="textindent textCut wteaml">{{match.HomeName}} vs {{match.AwayName}}</span><span class="leagueinfo textCut wteamr">{{match.LeagueName}}@{{match.ReportDate}}</span></div>\
						    <div class="messagefooter" :class = "{bgColor:halfTime()}">\
								    <span class="textindent floatleft">投注猜豆:<span class="yellow">{{Fmoney(info.money)}}</span></span>\
								    <span class="floatright textCut">预计返还:<span>{{Fmoney(info.backvalue)}}</span></span>\
						    </div>\
						</div>\
					</div>\
					<div v-if = "!halfTime()" class="messagebtn publishfooter"><a class="block floatleft twoDiv blue" @click="CloseMessage()">取消</a><a class="block floatleft  twoDiv blue" @click="ConfirmPub()">立即发布</a></div>\
				</div>\
	 </div>';
    var success = Vue.extend({
        template: successhtml,
        props: ["betResult"],
        data: function () {
            return {
                info: {
                    money: this.betResult.BetValue,
                    totalOdds: this.betResult.BetOdds,
                    matchlist: this.betResult.SubBets,
                    backvalue: this.betResult.BackAmount
                },
                BetID:this.betResult.BetID,
                halfTime:function(){
                	return this.betResult.SubBets[0].MarketName.indexOf("半场") !== -1
                }
                
            }
        },
        components: {
            //模
            successpub:w.component.successpub,
            messagepub:w.component.messagepub
            

        },
        created:function(){
        	console.log(this.betResult);
        	console.log(this.info.matchlist[0].MarketName);
        	console.log(this.halfTime());
        },
        methods: {
        	//确认发布
        	ConfirmPub: function () {
        		this.$emit("ConfirmPub",this.BetID);
            },
            MarketName: function (m) {
                return w.$config.MarketName[m.MarketID] || m.MarketName;
            },
            CloseMessage: function () {
                this.$emit("CloseMessage");
            },
            //格式化猜豆数据
            Fmoney: function (n) {
                return n.toString().fmoney();
            },
            showHDP: function (hdp, pos, market) {
                if (market <= 2 && market >= 1) {
                    return (hdp < 0 ? "-" : "+") + w.HandleData.ComputeHDP(hdp);
                }
                if (market <= 4 && market >= 3) {
                    return w.HandleData.ComputeHDP(hdp);
                }
                return "";
            },
            Hdp: function (hdp) { //计算大小hdp
                return w.HandleData.ComputeHDP(hdp);
            },
            HdpH: function (hdp) { //计算主队让球hdp
                return w.HandleData.HdpH(hdp);
            },
            HdpA: function (hdp) { //计算客队让球hdp
                return w.HandleData.HdpA(hdp);
            }
        }
    });
    return success;
});