(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['leagueprocess'] = fun(w);
})(window, function (w) {
    var processhtml = '<div class="leagueslive">\
                    <datebar :sportId=sportId :datelist=datelist :currentDate=currentDate @ChangeDate=ChangeDate @ChangeSport=ChangeSport @ShowCaledener=ShowCaledener></datebar>\
	                <div  class="leagueplist xscroll"><div class="no-data-tips" v-show="(matchlist==null||matchlist.length==0)&&!isLoading">暂无数据</div>\
	                 <div v-for="(match,index) in matchlist" class="item" :class="{\'odditem\':(index%2==0)}" @click="SelectMatch(match.MID)">\
						<div class="leag floatleft"><div class="vertical"><span class="span1 leaguename textCut">{{match.LN}}</span><span  class="span1 ">{{MatchDate(match.MD)}}</span></div></div>\
						<div class="home floatleft"><div class="vertical textCut"><span  class="span2 w100">{{match.HN}}</span></div></div>\
						<div class="middle floatleft"><div class="vertical"><span class="span6">vs</span></div></div>\
						<div class="away floatleft"><div class="vertical textCut"><span class="span2 w100">{{match.AN}}</span></div></div>\
					</div></div>\
					<loading v-show="isLoading"></loading>\
				</div>';
    var process = Vue.extend({
        template: processhtml,
        props: ["sportId", "date"],
        data: function () {
            return {
                timer: null,//刷新时钟
                matchlist: [],
                datelist: [],//时间列表
                isLoading: false,
                currentDate: null
            }
        },
        components: {
            datebar: w.component.datebar,
            loading: w.component.loading
        },
        created: function () {
            this.GetDateList();
        },
        beforeDestroy: function () {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
                this.type = "stopped";
            }
        },
        methods: {
            GetDateList: function () {//获得时间列表
                this.datelist = w.Tools.GetDateList(new Date(), 7);
                var bool = w.Tools.ArrayContain(this.datelist, this.date, "date");
                if (bool) {
                    this.currentDate = this.date;
                } else {
                    this.currentDate = this.datelist[1].date;
                    this.$emit("ChangeDate", this.currentDate);
                }
                this.isLoading = true;
                this.GetData(false);
            },

            GetData: function (refresh, callback) {
                var gu = this;
                w.Api.GetProcessLeague({ SportId: this.sportId, reportDate: this.currentDate }, function (data) {
                    if (data.Success) {
                        if (refresh) {
                            if (typeof (callback) == "function") callback(data.Data);
                        } else {

                            if (data.Data == null) {
                                gu.matchlist = [];
                            } else {
                                gu.matchlist = data.Data;
                            }
                            gu.isLoading = false;
                            //取消loading
                            gu.ReashData();
                        }
                    } else {
                        console.log(data.ErrorMsg);
                    }
                    gu = null;
                }, function (err) {
                    gu.isLoading = false;
                    console.log("err=" + err.Message);//提示错误
                });
            },
            ReashData: function () {
                var gu = this;
                this.timer = setTimeout(function () {
                    gu.GetData(true, function (data) {
                        gu.matchlist = data;
                        gu.ReashData();
                        gu = null;
                    })
                }, w.$config.RefreshTime.LeagueProcess)
            },
            //联赛时间
            MatchDate: function (datestr) {
                return datestr.substr(datestr.length - 5, 5);
            },
            SelectMatch: function (mid) {
                this.$emit("SelectMatch", mid);
            },
            //是否显示日历
            ShowCaledener: function (bool) {
                this.$emit("ShowCaledener", bool);
            },
            //变更时间
            ChangeDate: function (date) {
                if (this.currentDate == date) {
                    return;
                }
                this.currentDate = date;
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.GetData(false);
                this.$emit("ChangeDate", date)
            },
            ChangeSport: function (sportId) {
                this.sportId = sportId;
                this.isLoading = true;
                this.GetData(false);
                this.$emit("ChangeSport", sportId)
            }
        }
    })
    return process;
});