/*
 * 具体比赛头部
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['matchheader'] = fun(w);
})(window, function (w) {
    var matchhtml = '<div class="matchheader">\
				<div class="header white league">{{LN}}<a class="rule" @click="ShowRule()">游戏规则</a></div>\
				<div class="header white time"><span v-if="Stage==3">{{LiveTime}}</span><span v-if="Stage!=3">{{MD}}</span></div>\
				<div class="white"><span :class="\'homename block  textCut \'+(Stage==3?\'live\':\'\')">{{HN}}</span><span class="score block " v-if="Stage==3">{{HS}} : {{AS}}</span>\
				<span v-if="Stage!=3" class="vs block "> vs </span><span :class="\'awayname block  textCut \'+(Stage==3?\'live\':\'\')">{{AN}}</span></div>\
			</div>';
    var matchheader = Vue.extend({
        template: matchhtml,
        props: ["SID", "LN", "HN", "AN", "Stage", "PH", "LT", "MD", "HC", "AC", "HS", "AS"],
        computed: {
            LiveTime: function () {
                return w.HandleData.ComputeLiveTime(this.SID, this.PH, this.LT);
            }
        },
        methods: {
            ShowRule: function () {
                //显示玩法规则
                this.$router.push({ name: "rule" });
            }
        }
    });
    return matchheader;
});