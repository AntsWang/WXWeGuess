/*
 * 竞猜头部
 * 传入参数格式balance:10000,sportList=[{sportName:"足球",sportId:1}]
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['guessheader'] = fun(w);
})(window, function (w) {
    var headerhtml = '<div class="header guessheader" id="header">\
			<div class="uerinfo">\
				<i class="floatleft block wgicon icon_balance" @click=Debug></i><span class="yellow">{{ShowBalance(balance)}}</span>\
				<a class="floatright  wgicon icon_statement" @click="ShowStatement()"></a>\
				<a class="floatright  wgicon icon_ranking" @click="ShowRanking()"></a>\
			</div>\
            <notice></notice>\
			<div class=\"typebtn\">\
				<sportbox ref="box" :sportId=sportId class="sportbox fourDiv floatleft" @ChangeSport=ChangeSport></sportbox>\
				<a  :class="{\'noselect\':(type!=\'time\'),\'select\':(type==\'time\')}"  v-on:click=\'ChangeHeaderBtn("time")\'>按日期</a>\
				<a  :class="{\'noselect\':(type!=\'league\'),\'select\':(type==\'league\')}"   v-on:click=\'ChangeHeaderBtn("league")\'>按比赛</a>\
				<a  :class="{\'noselect\':(type!=\'live\'),\'select\':(type==\'live\')}"  v-on:click=\'ChangeHeaderBtn("live")\'>滚球</a>\
				<a  :class="{\'noselect\':(type!=\'mix\'),\'select\':(type==\'mix\')}"  v-on:click=\'ChangeHeaderBtn("mix")\'>串关</a>\
			</div><div id="debug" class="debug"><span class="close" @click="CloseDebug()">X</span><div id="debug_c" class="debug_c"></div>\
                    <span id="cmdline"><textarea id="ipt"/><button @click=SubmitCode>submit</button></span></div>\
			</div>';
    var header = Vue.extend({
        template: headerhtml,
        name: "header",
        props: ["type", "sportId", "sportList"],
        data: function () {
            return {
                btnlist: {
                    time: true,//按时间
                    league: false,//按联赛
                    live: false,//滚球
                    mix: false//串关
                },
                debugcount: 0,
                timer: 0,
                balance: w.Api.Balance
            }
        },
        components: {
            sportbox: w.component.sportbox,
            notice: w.component.notice
        },
        mounted: function () {
            var that = this;
            w.vbus.$on("BalanceUpdated", function (v) {
                that.balance = v;
            });
        },
        methods: {

            ShowBalance: function (v) {
                if (v == -1) {
                    return "-";
                }
                return this.Fmoney(v);
            },
            Debug: function () {
                clearTimeout(this.timer);
                this.debugcount += 1;
                if (this.debugcount >= 3) {
                    document.getElementById("debug").classList.add("active");
                    console.debug("当前设备视口宽度 " + document.documentElement.clientWidth);
                    console.debug("当前设备像素比 " + window.devicePixelRatio);
                }
                var that = this;
                this.timer = setTimeout(function () {
                    that.debugcount = 0;
                }, 3000);
            },
            CloseDebug: function () {
                document.getElementById("debug").classList.remove("active");
            },
            SubmitCode: function () {
                try {
                    document.getElementById("ipt").focus();
                    var that = this;
                    var r = eval(document.getElementById("ipt").value);
                    console.info(r);
                } catch (e) {
                    console.error(e);
                }

            },
            //变更体育种类
            ChangeSport: function (sportId) {
                this.$emit("ChangeSport", sportId);
            },
            //变更显示类型
            ChangeHeaderBtn: function (type) {
                if (this.type == type) return;
                //this.type=type;
                /*for(var i in this.btnlist){
					if(i==type){
						this.btnlist[type]=true;
					}else{
						this.btnlist[i]=false;
					}
				}*/
                this.$emit("ChangeType", type);
            },
            //显示投注记录
            ShowStatement: function () {
                this.$emit("ShowStatement");
            },
            //显示排行榜
            ShowRanking: function () {
                this.$emit("ShowRanking");
            },
            //格式化猜豆数据
            Fmoney: function (n) {
                return n.toString().fmoney();
            }
        }
    });
    return header;
});