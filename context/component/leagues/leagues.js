(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['leaguesPage'] = fun(w);
})(window, function (w) {
    var leaguehtml = '<div class="leaguesPage">\
					<div class="leaguetabs">\
					<a class="tab" :class="{\'select\':(type==\'live\')}" @click="ChangeType(\'live\')">即时</a>\
					<a  class="tab" :class="{\'select\':(type==\'result\')}" @click="ChangeType(\'result\')">赛果</a>\
					<a  class="tab" :class="{\'select\':(type==\'process\')}" @click="ChangeType(\'process\')">赛程</a></div>\
					<div id="pane" class="pane" :class="{\'scrollpane\':isShowCaledener}">\
						<leaguelive  v-if="type==\'live\'" @SelectMatch=SelectMatch></leaguelive>\
						<leagueresult :sportId=sportId :date=currentDate v-if="type==\'result\'" @ChangeSport=ChangeSport @ChangeDate=ChangeDate @ShowCaledener=ShowCaledener></leagueresult>\
						<leagueprocess :sportId=sportId :date=currentDate  v-if="type==\'process\'"  @SelectMatch=SelectMatch @ChangeSport=ChangeSport @ChangeDate=ChangeDate @ShowCaledener=ShowCaledener></leagueprocess>\
					</div>\
				</div>';
    var league = Vue.extend({
        template: leaguehtml,
        name: "leagues",
        props: [],
        data: function () {
            var sportid = 1;
            var ltype = "live";
            var currentdate = null;
            if (this.$route.params.type) {
                ltype = this.$route.params.type;
            }
            if (this.$route.params.sportId) {
                sportid = this.$route.params.sportId;
            }
            if (ltype == "result") {
                currentdate = new Date(new Date() - 12 * 60 * 60 * 1000).format("YY-MM-dd");
            } else if (ltype == "process") {
                currentdate = new Date().getReportDate().addHours(24).format("YY-MM-dd");
            }
            if (this.$route.params.date) {
                currentdate = this.$route.params.date;
            }
            return {
                type: ltype,
                sportId: sportid,
                currentDate: currentdate,
                isShowCaledener: false
            }
        },
        watch: {
            currentDate: function (date) {
                this.$router.replace({ name: "leagues", params: { date: date } });
            }
        },
        components: {
            leaguelive: w.component.leaguelive,
            leagueresult: w.component.leagueresult,
            leagueprocess: w.component.leagueprocess
        },
        mounted: function () {
            //var ele = document.getElementById('pane');
            //if (ele) {
            //    ele.style.height = (window.innerHeight - 73) + "px";
            //    document.body.style.height = (window.innerHeight - 39) + "px";
            //}
            vbus.$emit("SetTitle", "赛事");
        },
        methods: {
            //头部切换显示类型
            ChangeType: function (type) {
                if (this.type == type) return;
                this.type = type;
                this.$router.push({ name: "leagues", params: { type: type } });
            },
            SelectMatch: function (matchId) {
                if (window != top) {
                    top.NoticeRoute("#/match/" + matchId+"/0/0");
                } else {
                    this.$router.push({
                        name: 'match', params: {
                            matchId: matchId,
                            marketid: 0,
                            betpos: 0
                        }
                    });
                }


            },
            ChangeDate: function (date) {
                this.currentDate = date;
            },
            ChangeSport: function (sportId) {
                this.sportId = sportId;
            },
            ShowCaledener: function (bool) {
                this.isShowCaledener = bool;
            }
        }
    })
    return league;
});