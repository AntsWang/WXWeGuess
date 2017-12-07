/*
 * 按时间选择
 * 确定时间是否为固定，还是由服务器传入？
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    if (typeof (fun) == "function") {
        w.component['timeitem'] = fun(w);
    }
})(window, function (w) {
    var timehtml = '<div id="time" class="time xscroll">\
						<a class="timeitem verticalcenter" v-for="(date,index) in datelist" v-bind:class="{\'select\': index==selectIndex}" @click="ChangeTime(index,date.MList)">\
							<div>\
							<span>{{date.RD}}</span>\
							<span>{{date.WK}}({{date.MList.length}})</span>\
							</div>\
						</a>\
						<div class="sideline" :style="\'height:calc(100% - \'+(datelist.length*5)+\'em - \'+(datelist.length)+\'px)\'"></div>\
						<loading v-show="isLoading"></loading>\
				</div>';
    var time = Vue.extend({
        name: "timeItem",
        template: timehtml,//模板
        props: ["sportId", "xtype"],//父组件传入值
        data: function () {//数据
            var pindex = 0;
            if (this.$route.params.index) {
                pindex = this.$route.params.index;
            }
            return {
                timer: null, //刷新时钟
                datelist: [],
                selectIndex: !isNaN(pindex) ? pindex : 0, //用于显示效果,无逻辑作用
                isLoading: false,
                type: this.xtype
            }
        },
        components: {//模组
            loading: w.component.loading
        },
        watch: {//监听器
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
                    this.ChangeTime(pindex);
                }
            }
        },
        created: function () { //初始化页面渲染前执行
            this.isLoading = true;
            var that = this;
            this.GetData(false);

        },
        beforeDestroy: function () {//销毁页面前执行
            this.DestoryTimer();
        },
        methods: {//方法
            GetData: function (refresh, callback) {
                var gu = this;
                w.Api.GetOddsByTime({
                    SportId: this.sportId
                }, function (data) {
                    if (data.Success) {
                        if (refresh) {
                            if (typeof (callback) == "function") callback(data.Data);
                        } else {

                            if (data.Data == null || data.Data.length <= 0) {
                                gu.datelist = [];
                                gu.$emit("ChangeTime", []);
                                if (!!data.ErrorMsg) {
                                    w.vbus.$emit("ShowToast", data.ErrorMsg);
                                }
                            } else {
                                gu.datelist = data.Data;
                                if (gu.selectIndex > gu.datelist.length - 1) {
                                    gu.selectIndex = 0;
                                }
                                gu.ChangeTime(gu.selectIndex); //初始化时默认选种第一个
                            }
                            gu.$emit("ComputedHeight");
                            gu.isLoading = false; //取消loading
                            gu.ReashData();
                        }
                    } else {
                        console.log(data.ErrorMsg);
                    }
                    li = null;
                }, function (err) {
                    gu.isLoading = false;
                    console.log("err=" + err.Message);//提示错误
                    gu.$emit("ChangeTime", []);
                });
            },
            //刷新
            ReashData: function () {
                var gu = this;
                this.timer = setTimeout(function () {
                    if (gu.type != "time") {
                        return;
                    }
                    console.log("timerefresh");
                    gu.GetData(true, function (data) {
                        if (gu.type != "time") {
                            return;
                        }
                        gu.datelist = data;
                        gu.ChangeTime(gu.selectIndex);
                        gu.ReashData();
                        gu = null;
                    });
                }, w.$config.RefreshTime.GuessTime);
            },
            ChangeTime: function (index) {
                this.selectIndex = index;
                if (this.datelist == null || this.datelist.length <= 0) {
                    this.datelist = [];
                    this.$emit("ChangeTime", []);
                    return;
                }
                var matchlist = this.datelist[index].MList;
                this.$emit("ChangeTime", matchlist);
                if (this.$route.name != "guess") {
                    return;
                }
                this.$router.replace({ name: "guess", params: { index: index, type: "time" } });
            },
            DestoryTimer: function () {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                    this.type = "stopped";
                }
            }
        }
    })
    return time;
});