/*
 * 按联赛选择
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    if (typeof (fun) == "function") {
        w.component['leagueitem'] = fun(w);
    }
})(window, function (w) {
    var leaguehtml = '<div id="league" class="league">\
						<a class="leagueitem verticalcenter" v-for="(league,index) in leaguelist" v-bind:class="{\'select\':index==selectIndex}" @click="ChangeLeague(index)">\
							<span class = "name textCut"> {{league.LN}}</span>\
							<span > ({{ListLength(league)}})</span>\
						</a>\
						<div class="sideline" :style="\'height:calc(100% - \'+(leaguelist.length*5)+\'em - \'+(leaguelist.length)+\'px)\'"></div>\
						<loading v-show="isLoading"></loading>\
				</div>';
    var league = Vue.extend({
        template: leaguehtml,
        name: "leagueItem",
        props: ["sportId", "xtype"],
        data: function () {
            var pindex = 0;
            if (this.$route.params.index) {
                pindex = this.$route.params.index;
            }
            return {
                timer: null, //刷新时钟
                leaguelist: [],
                selectIndex: !isNaN(pindex) ? pindex : 0, //用于显示效果,无逻辑作用
                isLoading: false,
                type: this.xtype
            }
        },
        components: {
            loading: w.component.loading
        },
        watch: {
            sportId: function () { //运动类型改变
                this.DestoryTimer();
                this.isLoading = true;
                this.GetData(false);
            },
            '$route': function () {
                var pindex = 0;
                if (this.$route.params.index) {
                    pindex = this.$route.params.index;
                }
                if (!isNaN(pindex)) {
                    this.ChangeLeague(pindex);
                }
            }
        },
        created: function () {
            this.isLoading = true;
            var that = this;
            this.GetData(false);
        },
        beforeDestroy: function () {
            this.DestoryTimer();
        },
        methods: {
            GetData: function (refresh, callback) {
                var gu = this;
                w.Api.GetOddsByLeague({
                    SportId: this.sportId
                },
                    function (data) {
                        gu.isLoading = false; //取消loading
                        if (data.Success) {
                            //自动刷新
                            if (refresh) {
                                if (typeof (callback) == "function") callback(data.Data);
                            } else {
                                //初始化时获取
                                if (data.Data == null || data.Data.length <= 0) {
                                    gu.leaguelist = [];
                                    gu.$emit("ChangeLeague", []);
                                } else {
                                    gu.leaguelist = data.Data;
                                    if (gu.selectIndex > gu.leaguelist.length - 1) {
                                        gu.selectIndex = 0;
                                    }
                                    gu.ChangeLeague(gu.selectIndex); //初始化时默认选种第一个
                                }
                                gu.$emit("ComputedHeight");
                                gu.ReashData();
                            }
                        } else {
                            console.log(data.ErrorMsg);
                            gu.ReashData();
                        }
                        gu = null;
                    },
                    function (err) {
                        gu.isLoading = false;
                        console.log("err=" + err.Message); //提示错误
                        gu.$emit("ChangeLeague", []);
                        gu.ReashData();
                    });
            },
            ReashData: function () {
                var gu = this;
                this.timer = setTimeout(function () {
                    if (gu.type != "league") {
                        return;
                    }
                    gu.GetData(true,
                        function (data) {
                            if (gu.type != "league") {
                                return;
                            }
                            gu.leaguelist = data;
                            gu.ChangeLeague(gu.selectIndex);
                            gu.ReashData();
                            gu = null;
                        });
                }, w.$config.RefreshTime.GuessLeague);
            },
            ListLength: function (league) {
                if (league && league.MList) {
                    return league.MList.length;
                }
                return 0;
            },
            ChangeLeague: function (index) {
                this.selectIndex = index;
                if (this.leaguelist == null || this.leaguelist.length <= 0) {
                    this.leaguelist = [];
                    this.$emit("ChangeLeague", []);
                    return;
                }
                var matchlist = this.leaguelist[index].MList;
                this.$emit("ChangeLeague", matchlist);
                if (this.$route.name != "guess") {
                    return;
                }
                this.$router.replace({ name: "guess", params: { index: index, type: "league" } });
            },
            DestoryTimer: function () {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                    this.type = "stopped";
                }
            }
        }
    });
    return league;
});