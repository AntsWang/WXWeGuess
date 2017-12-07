(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['leaguelive'] = fun(w);
})(window, function (w) {
    var livehtml = '<div class="leagueslive xscroll"><div>\
                    <div class="no-data-tips" v-show="(matchlist==null||matchlist.length==0)&&!isLoading">暂无数据</div>\
					<div v-for="(match,index) in matchlist" class="item" :class="{\'odditem\':(index%2==0)}" @click="SelectMatch(match.MID)">\
						<div class="leag floatleft textCut"><div class="vertical"><span class="span1">{{match.LN}}</span><span  class="span1  yellow">{{LiveTime(1,match.PH,match.LT)}}</span></div></div>\
						<div class="home floatleft textCut"><div class="vertical"><span  :class="\'redcard \'+(match.HC==0?\'zero\':\'\')">{{match.HC}}</span><span  class="span2">{{match.HN}}</span></div></div>\
						<div class="middle floatleft textCut"><div class="vertical">\
                        <span class="span1 span4 halfscore">({{match.HSH}}-{{match.ASH}})</span>\
                        <span class="span3">{{match.HS}}-{{match.AS}}</span>\
                        </div></div>\
						<div class="away floatleft textCut"><div class="vertical"><span class="span2">{{match.AN}}</span><span  :class="\'redcard \'+(match.AC==0?\'zero\':\'\')">{{match.AC}}</span></div></div>\
					</div>\
					<loading v-show="isLoading"></loading>\
				</div></div>';
    var live = Vue.extend({
        template: livehtml,
        props: [],
        data: function() {
            return {
                timer: null, //刷新时钟
                matchlist: [],
                isLoading: false
            }
        },
        components: {
            loading: w.component.loading
        },
        created: function() {
            this.isLoading = true;
            this.GetData(false);
        },
        beforeDestroy: function() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
                this.type = "stopped";
            }
        },
        methods: {
            GetData: function(refresh, callback) {
                var gu = this;
                w.Api.GetTimeLeague({ SportId: 1 }, function(data) {
                    if (data.Success) {
                        if (refresh) {
                            if (typeof (callback) == "function") callback(data.Data);
                        } else {
                            gu.isLoading = false;
                            if (data.Data == null) {
                                gu.matchlist = [];
                            } else {
                                gu.matchlist = data.Data;
                            }
                            //取消loading
                            gu.ReashData();
                        }
                    } else {
                        console.log(data.ErrorMsg);
                    }
                    le = null;
                }, function(err) {
                    gu.isLoading = false;
                    console.log("err=" + err.Message); //提示错误
                });
            },
            LiveTime: function(sid, ph, lt) {
                return w.HandleData.ComputeLiveTime(sid, ph, lt)
            },
            ReashData: function() {
                var gu = this;
                this.timer = setTimeout(function() {
                    gu.GetData(true, function(data) {
                        gu.matchlist = data;
                        gu.ReashData();
                        gu = null;
                    })
                }, w.$config.RefreshTime.LeagueLive)
            },
            SelectMatch: function(mid) {
                this.$emit("SelectMatch", mid);
            }
        }
    });
    return live;
});
