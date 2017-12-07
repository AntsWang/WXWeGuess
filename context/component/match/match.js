/*
 * 具体比赛
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['match'] = fun(w);
})(window, function (w) {
    var matchhtml = '<div class="fullh">\
					<matchheader :SID=match.SID :LN=match.LN :HN=match.HN :AN=match.AN :Stage=match.Stage :PH=match.PH :LT=match.LT :MD=match.MD :HC=match.HC :AC=match.AC :HS=match.HS :AS=match.AS></matchheader>\
					<div id="match" class="match xscroll" :class="{\'scrollpane\':!isShowBet}">\
						<div><div class="oddtitle textindent black textCut" v-if="HasOwnProperty(match.MK,\'5\')" ><span>全场赛果:</span><span class="gray">猜90分钟内比赛结果(含伤停补时)</span></div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'5\')">\
							<a id="5-1" class="threeDiv longer textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(5,0,1))}" @click=\"InitBet(match.MK[\'5\'][0][1],1,match.MK[\'5\'][0][0],5)\"><span class="black textCut">{{match.HN}}</span><span class=\"oddbet block yellow\">{{FO(match.MK["5"][0][1])}}<i :class="{\'oddup\':(OddChange(5,0,1)==1),\'odddown\':(OddChange(5,0,1)==2)}"></i></span></a>\
						   	<a id="5-3" class="threeDiv shorter textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(5,0,3))}" @click=\"InitBet(match.MK[\'5\'][0][3],3,match.MK[\'5\'][0][0],5)\"><span class="black textCut">和局</span><span class=\"oddbet block yellow\">{{FO(match.MK["5"][0][3])}}<i :class="{\'oddup\':((OddChange(5,0,3))==1),\'odddown\':(OddChange(5,0,3)==2)}"></i></span></a>\
						   	<a id="5-2" class="threeDiv longer textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(5,0,2))}" @click=\"InitBet(match.MK[\'5\'][0][2],2,match.MK[\'5\'][0][0],5)\"><span class="black textCut">{{match.AN}} </span><span class=\"oddbet block yellow\">{{FO(match.MK["5"][0][2])}}<i :class="{\'oddup\':((OddChange(5,0,2))==1),\'odddown\':(OddChange(5,0,2)==2)}"></i></span></a>\
						</div>\
                        <div class="oddtitle textindent black textCut" v-if="HasOwnProperty(match.MK,\'1\')"><span>全场让球:</span><span class="gray">猜90分钟内比赛结果(含伤停补时)</span></div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'1\')">\
							 <a id="1-1" class="twoDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(1,0,1))}" @click=\"InitBet(match.MK[\'1\'][0][1],1,match.MK[\'1\'][0][0],1)\"><span class="black"><b class="letball textCut">{{match.HN}}</b> {{HdpH(match.MK["1"][0][3])}}</span><span class=\"oddbet block yellow\">{{FO(match.MK["1"][0][1])}}<i :class="{\'oddup\':((OddChange(1,0,1))==1),\'odddown\':(OddChange(1,0,1)==2)}"></i></span></a>\
						   <a id="1-2" class="twoDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(1,0,2))}" @click=\"InitBet(match.MK[\'1\'][0][2],2,match.MK[\'1\'][0][0],1)\"><span class="black"><b class="letball textCut">{{match.AN}}</b> {{HdpA(match.MK["1"][0][3])}}</span><span class=\"oddbet block yellow\">{{FO(match.MK["1"][0][2])}}<i :class="{\'oddup\':((OddChange(1,0,2))==1),\'odddown\':(OddChange(1,0,2)==2)}"></i></span></a>\
						</div>\
                        <div class="oddtitle textindent black textCut" v-if="HasOwnProperty(match.MK,\'3\')"><span>全场大小:</span><span class="gray">猜90分钟内比赛结果(含伤停补时)</span></div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'3\')">\
						   <a id="3-1" class="twoDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(3,0,1))}" @click=\"InitBet(match.MK[\'3\'][0][1],1,match.MK[\'3\'][0][0],3)\"><span class="black textCut">大于 {{Hdp(match.MK["3"][0][3])}}</span> <span class=\"oddbet block yellow\">{{FO(match.MK["3"][0][1])}}<i :class="{\'oddup\':((OddChange(3,0,1))==1),\'odddown\':(OddChange(3,0,1)==2)}"></i></span></a>\
						   <a id="3-2" class="twoDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(3,0,2))}" @click=\"InitBet(match.MK[\'3\'][0][2],2,match.MK[\'3\'][0][0],3)\"><span class="black textCut">小于 {{Hdp(match.MK["3"][0][3])}}</span><span class=\"oddbet block yellow\">{{FO(match.MK["3"][0][2])}}<i :class="{\'oddup\':((OddChange(3,0,2))==1),\'odddown\':(OddChange(3,0,2)==2)}"></i></span></a>\
						</div>\
						<div class="oddtitle textindent black textCut" v-if="HasOwnProperty(match.MK,\'6\')" ><span>上半场赛果:</span><span class="gray">猜45分钟内比赛结果(含伤停补时)</span></div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'6\')">\
							<a id="6-1" class="threeDiv longer textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(6,0,1))}" @click=\"InitBet(match.MK[\'6\'][0][1],1,match.MK[\'6\'][0][0],6)\"><span class="black textCut">{{match.HN}}</span><span class=\"oddbet block yellow\">{{FO(match.MK["6"][0][1])}}<i :class="{\'oddup\':((OddChange(6,0,1))==1),\'odddown\':(OddChange(6,0,1)==2)}"></i></span></a>\
						   	<a id="6-3" class="threeDiv shorter textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(6,0,3))}" @click=\"InitBet(match.MK[\'6\'][0][3],3,match.MK[\'6\'][0][0],6)\"><span class="black textCut">和局</span><span class=\"oddbet block yellow\">{{FO(match.MK["6"][0][3])}}<i :class="{\'oddup\':((OddChange(6,0,3))==1),\'odddown\':(OddChange(6,0,3)==2)}"></i></span></a>\
						   	<a id="6-2" class="threeDiv longer textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(6,0,2))}" @click=\"InitBet(match.MK[\'6\'][0][2],2,match.MK[\'6\'][0][0],6)\"><span class="black textCut">{{match.AN}} </span><span class=\"oddbet block yellow\">{{FO(match.MK["6"][0][2])}}<i :class="{\'oddup\':((OddChange(6,0,2))==1),\'odddown\':(OddChange(6,0,2)==2)}"></i></span></a>\
						</div>\
                        <div class="oddtitle textindent black textCut" v-if="HasOwnProperty(match.MK,\'2\')"><span>上半场让球:</span><span class="gray">猜45分钟内比赛结果(含伤停补时)</span></div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'2\')">\
							 <a id="2-1" class="twoDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(2,0,1))}" @click=\"InitBet(match.MK[\'2\'][0][1],1,match.MK[\'2\'][0][0],2)\"><span class="black"><b class="letball textCut">{{match.HN}}</b> {{HdpH(match.MK["2"][0][3])}}</span><span class=\"oddbet block yellow\">{{FO(match.MK["2"][0][1])}}<i :class="{\'oddup\':((OddChange(2,0,1))==1),\'odddown\':(OddChange(2,0,1)==2)}"></i></span></a>\
						   <a id="2-1" class="twoDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(2,0,2))}" @click=\"InitBet(match.MK[\'2\'][0][2],2,match.MK[\'2\'][0][0],2)\"><span class="black"><b class="letball textCut">{{match.AN}}</b> {{HdpA(match.MK["2"][0][3])}}</span><span class=\"oddbet block yellow\">{{FO(match.MK["2"][0][2])}}<i :class="{\'oddup\':((OddChange(2,0,2))==1),\'odddown\':(OddChange(2,0,2)==2)}"></i></span></a>\
						</div>\
                        <div class="oddtitle textindent black textCut" v-if="HasOwnProperty(match.MK,\'4\')"><span>上半场大小:</span><span class="gray">猜45分钟内比赛结果(含伤停补时)</span></div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'4\')">\
						   <a id="4-1" class="twoDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(4,0,1))}" @click=\"InitBet(match.MK[\'4\'][0][1],1,match.MK[\'4\'][0][0],4)\"><span class="black textCut">大于 {{Hdp(match.MK["4"][0][3])}}</span> <span class=\"oddbet block yellow\">{{FO(match.MK["4"][0][1])}}<i :class="{\'oddup\':((OddChange(4,0,1))==1),\'odddown\':(OddChange(4,0,1)==2)}"></i></span></a>\
						   <a id="4-2" class="twoDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(4,0,2))}" @click=\"InitBet(match.MK[\'4\'][0][2],2,match.MK[\'4\'][0][0],4)\"><span class="black textCut">小于 {{Hdp(match.MK["4"][0][3])}}</span><span class=\"oddbet block yellow\">{{FO(match.MK["4"][0][2])}}<i :class="{\'oddup\':((OddChange(4,0,2))==1),\'odddown\':(OddChange(4,0,2)==2)}"></i></span></a>\
						</div>\
						<div class="oddtitle textindent black textCut" v-if="HasOwnProperty(match.MK,\'9\')"><span>全场波胆:</span><span class="gray">猜90分钟内完赛比分(含伤停补时)</span></div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'9\')">\
							<a id="9-6" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,6))}" @click=\"InitBet(match.MK[\'9\'][0][6],6,match.MK[\'9\'][0][0],9)\"><span class="black textCut">1:0</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][6])}}</span></a>\
						   	<a id="9-1" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,1))}" @click=\"InitBet(match.MK[\'9\'][0][1],1,match.MK[\'9\'][0][0],9)\"><span class="black textCut">0:0</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][1])}}</span></a>\
						   	<a id="9-2" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,2))}" @click=\"InitBet(match.MK[\'9\'][0][2],2,match.MK[\'9\'][0][0],9)\"><span class="black textCut">0:1 </span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][2])}}</span></a>\
						</div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'9\')">\
							<a id="9-11" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,11))}" @click=\"InitBet(match.MK[\'9\'][0][11],11,match.MK[\'9\'][0][0],9)\"><span class="black textCut">2:0</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][11])}}</span></a>\
						   	<a id="9-7" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,7))}" @click=\"InitBet(match.MK[\'9\'][0][7],7,match.MK[\'9\'][0][0],9)\"><span class="black textCut">1:1</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][7])}}</span></a>\
						   	<a id="9-3" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,3))}" @click=\"InitBet(match.MK[\'9\'][0][3],3,match.MK[\'9\'][0][0],9)\"><span class="black textCut">0:2 </span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][3])}}</span></a>\
						</div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'9\')">\
							<a id="9-12" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,12))}" @click=\"InitBet(match.MK[\'9\'][0][12],12,match.MK[\'9\'][0][0],9)\"><span class="black textCut">2:1</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][12])}}</span></a>\
						   	<a id="9-13" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,13))}" @click=\"InitBet(match.MK[\'9\'][0][13],13,match.MK[\'9\'][0][0],9)\"><span class="black textCut">2:2</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][13])}}</span></a>\
						   	<a id="9-8" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,8))}" @click=\"InitBet(match.MK[\'9\'][0][8],8,match.MK[\'9\'][0][0],9)\"><span class="black textCut">1:2 </span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][8])}}</span></a>\
						</div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'9\')">\
							<a id="9-16" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,16))}" @click=\"InitBet(match.MK[\'9\'][0][16],16,match.MK[\'9\'][0][0],9)\"><span class="black textCut">3:0</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][16])}}</span></a>\
						   	<a id="9-19" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,19))}" @click=\"InitBet(match.MK[\'9\'][0][19],19,match.MK[\'9\'][0][0],9)\"><span class="black textCut">3:3</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][19])}}</span></a>\
						   	<a id="9-4" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,4))}" @click=\"InitBet(match.MK[\'9\'][0][4],4,match.MK[\'9\'][0][0],9)\"><span class="black textCut">0:3 </span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][4])}}</span></a>\
						</div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'9\')">\
							<a id="9-17" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,17))}" @click=\"InitBet(match.MK[\'9\'][0][17],17,match.MK[\'9\'][0][0],9)\"><span class="black textCut">3:1</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][17])}}</span></a>\
						   	<a id="9-25" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,25))}" @click=\"InitBet(match.MK[\'9\'][0][25],25,match.MK[\'9\'][0][0],9)\"><span class="black textCut">4:4</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][25])}}</span></a>\
						   	<a id="9-9" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,9))}" @click=\"InitBet(match.MK[\'9\'][0][9],9,match.MK[\'9\'][0][0],9)\"><span class="black textCut">1:3 </span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][9])}}</span></a>\
						</div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'9\')">\
							<a id="9-18" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,18))}" @click=\"InitBet(match.MK[\'9\'][0][18],18,match.MK[\'9\'][0][0],9)\"><span class="black textCut">3:2</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][18])}}</span></a>\
						   	<a id="9-26" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,26))}" @click=\"InitBet(match.MK[\'9\'][0][26],26,match.MK[\'9\'][0][0],9)\"><span class="black fourBall textCut">主5球及以上</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][26])}}</span></a>\
						   	<a id="9-14" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,14))}" @click=\"InitBet(match.MK[\'9\'][0][14],14,match.MK[\'9\'][0][0],9)\"><span class="black textCut">2:3</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][14])}}</span></a>\
						</div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'9\')">\
							<a id="9-21" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,21))}" @click=\"InitBet(match.MK[\'9\'][0][21],21,match.MK[\'9\'][0][0],9)\"><span class="black textCut">4:0</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][21])}}</span></a>\
						   	<a id="9-27" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,27))}" @click=\"InitBet(match.MK[\'9\'][0][27],27,match.MK[\'9\'][0][0],9)\"><span class="black fourBall textCut">客5球及以上</span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][27])}}</span></a>\
						   	<a id="9-5" class="threeDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(9,0,5))}" @click=\"InitBet(match.MK[\'9\'][0][5],5,match.MK[\'9\'][0][0],9)\"><span class="black textCut">0:4 </span><span class=\"oddbet block yellow cs\">{{FO(match.MK["9"][0][5])}}</span></a>\
						</div>\
						<div class="oddtitle textindent black textCut" v-if="HasOwnProperty(match.MK,\'11\')"><span>全场总进球数:</span><span class="gray">猜90分钟内总进球数(含伤停补时)</span></div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'11\')">\
							 <a id="11-1" class="twoDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(11,0,1))}" @click=\"InitBet(match.MK[\'11\'][0][1],1,match.MK[\'11\'][0][0],11)\"><span class="black textCut">0-1</span><span class=\"oddbet block yellow tg\">{{FO(match.MK["11"][0][1])}}</span></a>\
						   <a id="11-2" class="twoDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(11,0,2))}" @click=\"InitBet(match.MK[\'11\'][0][2],2,match.MK[\'11\'][0][0],11)\"><span class="black textCut">2-3</span><span class=\"oddbet block yellow tg\">{{FO(match.MK["11"][0][2])}}</span></a>\
						</div>\
						<div class="odditem" v-if="HasOwnProperty(match.MK,\'11\')">\
						   <a id="11-3" class="twoDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(11,0,3))}" @click=\"InitBet(match.MK[\'11\'][0][3],3,match.MK[\'11\'][0][0],11)\"><span class="black textCut">4-6</span> <span class=\"oddbet block yellow tg\">{{FO(match.MK["11"][0][3])}}</span></a>\
						   <a id="11-4" class="twoDiv textindent block" :class="{\'selectBet\':(selectBetitem==BetItem(11,0,4))}" @click=\"InitBet(match.MK[\'11\'][0][4],4,match.MK[\'11\'][0][0],11)\"><span class="black textCut">7以上</span><span class=\"oddbet block yellow tg\">{{FO(match.MK["11"][0][4])}}</span></a>\
						</div>\
						<div class=""><span class="gray">*注:页面无赔率时处于封盘状态,不可投注</span></div>\
					</div></div>\
					<betpane v-if=\"isShowBet\" :isMix=false :betinfo=betinfo @CloseBetPane=CloseBetPane @SubmitBet=SubmitBet></betpane>\
					<betfail :type=isBetSuccess :betErrormsg=betErrormsg v-if="isBetSuccess==2" @CloseMessage=CloseMessage @ReSubmitBet=ReSubmitBet @CancelBet=CancelBet></betfail>\
					<betsuccess :betResult=betResult  v-if="isBetSuccess==1" @ConfirmPub=ConfirmPub  @CloseMessage=CloseMessage @ShowSuccessPub=ShowSuccessPub @ShowFailPub=ShowFailPub @ShowLoading=ShowLoading></betsuccess>\
				    <successpub v-if = "isShowSuc" @CloseMessagePub=CloseMessagePub></successpub>\
			        <messagepub v-if = "isShowMsg" @CloseMessagePub=CloseMessagePub :errMsg = errMsg></messagepub>\
					<loading v-show="isLoading" :loadingText=loadingText></loading>\
				</div>';
    var match = Vue.extend({
        name: "match",
        template: matchhtml,
        data: function () {
            return {
                matchId: this.$route.params.matchId,
                timer: null, //刷新时钟
                changelist: {}, //变更数据
                match: {
                    HN: "-",
                    AN: "-",
                    LN: "-"
                }, //比赛

                selectBetitem: "",//当前选中投注
                isShowBet: false, //是否显示投注界面
                isBetSuccess: 0,
                betParams: null,//投注参数(记录上次投注参数用于重新投注)

                betinfo: null, //投注信息
                betResult: null, //投注成功结果
                betErrormsg: "", //投注失败原因

                isLoading: false, //加载界面,只在进入显示,在刷新下无显示
                loadingText: "", //加载显示文字
                isShowSuc: false,//发布成功
                isShowMsg: false,//发布失败
                errMsg: "",//发布失败信息详情
                autoMarketID: this.$route.params.marketid,
                autoBetPos: this.$route.params.betpos,
     
            }
        },
        components: {
            matchheader: w.component.matchheader,
            betpane: w.component.betpane,
            betsuccess: w.component.betsuccess,
            betfail: w.component.betfail,
            loading: w.component.loading,
            successpub: w.component.successpub,
            messagepub: w.component.messagepub
        },
        created: function () {
            this.isLoading = true;
            this.GetOdd(false);
        },
        mounted: function () {
            //var ele = document.getElementById('match');
            //if (ele) {
            //    ele.style.height = (window.innerHeight - 109) + "px";
            //}
        },
        //切换前销毁
        beforeDestroy: function () {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
                this.type = "stopped";
            }
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
            FO: function (odds) {
                return w.HandleData.FormatOdds(odds);
            },
            //获取盘口数据
            GetOdd: function (refresh, callback) {
                var gu = this;
                w.Api.GetMatchOdd({
                    matchId: this.matchId
                }, function (data) {
                    if (data.Success) {

                        if (refresh) {
                            //自动刷新
                            if (typeof (callback) == "function") callback(data);
                            if (data.Data == null) {
                                gu.match = {};
                            } else {
                                gu.match = data.Data;
                            }
                        } else {
                            //首次获取
                            if (data.Data == null) {
                                gu.match = {};
                            } else {
                                gu.match = data.Data;
                            }

                            gu.isLoading = false; //取消loading
                            gu.$nextTick(function () {
                                //initScroll("#match");
                                //跟单自动点击
                                if (gu.autoMarketID > 0 && gu.autoBetPos > 0) {
                                    var x = document.getElementById(gu.autoMarketID + "-" + gu.autoBetPos);
                                    if (x != null) {
                                        x.click();
                                    } else {
                                        w.vbus.$emit("ShowToast", "该盘口此时为关闭状态,跟单失败.", 2000);
                                    }
                                }
                                //跟单自动点击
                            }),
                            gu.ReashData();
                        }
                    } else {
                        gu.isLoading = false;
                        console.log(data);
                        w.vbus.$emit("ShowToast", "获取比赛数据失败," + data.ErrorMsg, 5000);
                    }

                    //gu = null;
                }, function (err) {
                    gu.isLoading = false;
                    console.log("err=" + err.Message);//提示错误
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
            BetItem: function (marketid, index, betpos) {//投注列
                return "{0}-{1}-{2}".format(marketid, index, betpos);
            },
            //获取投注详细
            InitBet: function (betodd, betpos, couid, marketid) {
                if (betodd == 0) {
                    w.vbus.$emit("ShowToast", "该盘口此时为关闭状态.", 1000);
                    return;
                }
                this.selectBetitem = "{0}-{1}-{2}".format(marketid, 0, betpos);
                var gu = this;
                var parma = {
                    betOdds: betodd,
                    betPos: betpos,
                    couid: couid,
                    matchId: this.matchId,
                    marketId: marketid
                };
                this.ShowLoading(w.Language.LoadingText.LoadGetBet);
                //获取投注信息
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
                            console.error("获取注单错误 " + data.ErrorMsg, data);
                            w.vbus.$emit("ShowToast", "请求注单失败,请重试或者刷新页面.", 2000);
                            break;
                    }
                }, function (err) {
                    gu.isLoading = false;
                    console.log("err=" + err.Message);//提示错误
                });
            },
            //提交投注  按日期 按比赛
            SubmitBet: function (params) {
                this.isShowBet = false;
                this.ShowLoading(w.Language.LoadingText.LoadBet);
                var gu = this;
                w.Api.Bet(params, function (data) {
                    gu.selectBetitem = "";
                    gu.isLoading = false;
                    //投注成功
                    if (data.BetResult === 0) {

                        gu.isBetSuccess = 1;
                        gu.betResult = data.Data;
                        this.betParams = null;

                    } else if (data.BetResult === 2 || data.BetResult === 3) {
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
                            //重新请求
                            gu.InitBet(params.Odds, params.BetPos, params.CouID, params.MarketID);
                        } else {

                        }

                    } else {
                        //处理异常状态
                        console.log("投注异常", data);
                        switch (data.BetResult) {

                            //case w.$config.BetResultEnum.HdpChanged:
                            //case w.$config.BetResultEnum.OddsChanged:
                            //    //提示是否继续投注
                            //    if (gu.betParams) {
                            //        gu.betParams.Odds = data.Data.BetInfo.NewOdds;
                            //        gu.betParams.BetHdp = data.Data.BetInfo.BetHdp;
                            //    }
                            //    gu.isBetSuccess = 3;
                            //    gu.betErrormsg = data.Data;
                            //    break;
                            //case w.$config.BetResultEnum.Fail:
                            //case w.$config.BetResultEnum.LessMinLimit:
                            //case w.$config.BetResultEnum.OverMaxlimit:
                            default:
                                gu.isBetSuccess = 2; //投注失败
                                gu.betErrormsg = data.ErrorMsg || "盘口关闭";
                                gu.betParams = null;
                                break;
                        }
                    }
                    gu.UpdateBalance();
                }, function (err) {
                    gu.UpdateBalance();
                    gu.selectBetitem = "";
                    gu.isLoading = false;
                    console.log("err=" + err.Message);//提示错误
                });
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
                //是否清除已选投注信息
                this.selectBetitem = "";
                this.isShowBet = false;
            },
            //关闭提示框
            CloseMessage: function () {
                this.isBetSuccess = 0;

            },
            OddChange: function (maketid, index, oddindex) {
                var key = "{0}-{1}-{2}".format(maketid, index, oddindex);
                if (this.changelist.hasOwnProperty(key)) return this.changelist[key];
                return 0;
            },
            //刷新盘口数据
            ReashData: function () {
                var gu = this;
                this.timer = setTimeout(function () {
                    gu.GetOdd(true, function (data) {
                        gu.CompareChange(data);
                        gu.ReashData();
                        gu = null;
                    });
                }, 30000);
            },
            //获取盘口变更
            CompareChange: function (newdata) {
                this.changelist = w.HandleData.MatchChange(this.match, newdata.Data);
            },
            //显示加载按钮
            ShowLoading: function (text) {
                console.log(text);
                this.isLoading = true;
                this.loadingText = text;
            },
            HasOwnProperty: function (object, key) {
                if (object && object.hasOwnProperty(key)) {
                    return true;
                }
                return false;
            },
            UpdateBalance: function () {
                w.vbus.$emit("UpdateBalance");
            }
        }
    });
    w.Vue.component("match", match);
    return match;
});