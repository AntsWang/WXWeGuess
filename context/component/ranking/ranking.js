/*
 * 排行榜
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['ranking'] = fun(w);
})(window, function (w) {
    var rankinghtml = '' +
'<div class="ranking">\
	<div class="rank_head">\
		<div id="ranklist-tabs">\
		   <span @click="ShowWeek()" :class="{\'tab\':true,\'tabselected\':isShowWeek}"><span class="tab_text">周排行</span></span>\
			<span @click="ShowMonth()" :class="{\'tab\':true,\'tabselected\':!isShowWeek}"><span class="tab_text">月排行</span></span>\
		</div>\
		<div class="title"><span class="rank ">排名</span><span class="headname ">&nbsp;</span><span class="nickname ">昵称</span><span class="winodd ">胜率</span></div>\
	</div>\
	<div class="wrapper xscroll"><div>\
		<div class="blue rankpane" v-if="userInfo"><span class="rank ">{{userInfo.Rank}}</span><span class="headname"><img  class="headimg headname" :src="avartar"></span><span class="nickname ">{{(userNick||\'\')+\'(我自己)\'}}</span><span  class="winodd ">{{userInfo.WinRate}}</span></div>\
		<div class="rankpane"  v-for="(item,index) in ranklists" :class="{\'odditem\':(index%2!=0),\'evenitem\':(index%2==0)}">\
			<span  class="rank">{{item.Rank}}</span><span class="headname"><img  class="headimg" :src="GetAvartarUrl(item)"></span><span  class="nickname" >{{item.Nickname}}</span><span  class="winodd  yellow">{{item.WinRate}}</span>\
		</div>\
       <span class="rank_tips">*注: 此排行榜只显示前50名</span>\
	</div></div>\
	<loading v-show="isLoading" :message="\'加载中\'"></loading>\
</div>';
    var ranking = Vue.extend({
        template: rankinghtml,
        //props:["userId"],
        data: function () {
            return {
                ranklists: [],
                userInfo: null,
                isLoading: true,
                isShowWeek: true,
                avartar: "",
                userNick:""
            }
        },
        created: function () {
            vbus.$emit("SetTitle", "排行榜");
            this.GetData(this.isShowWeek);
        },
        computed: {

        },
        components: {
            loading: w.component.loading
        },
        methods: {
            GetAvartarUrl: function (u) {
                return u.HeadPicture || "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494912638653&di=7b44b9686ea468d13eeae8960983e4d6&imgtype=0&src=http%3A%2F%2Fi2.sanwen8.cn%2Fdoc%2F1611%2F781-16111QG515-51.jpg";
            },
            GetData: function () {
                var that = this;
                that.isLoading = true;
                w.Api.GetRankList(that.isShowWeek, function (d) {
                    if (d.Data) {
                        var iinlist = false;
                        var t = [];
                        var list = d.Data.Data;
                        that.avartar = d.Data.OwnerHeadPicture;
                        that.userNick = d.Data.Nickname;
                        for (var i in list) {
                            if (list.hasOwnProperty(i)) {
                                var u = list[i];
                                u.WinRate = (u.WinRate * 100).toFixed(2) + "%";
                                u.Rank = (+i) + 1;
                                u.Nickname = u.Nickname || "(无昵称)";
                                if (!u.IsOwner) {
                                    t.push(u);
                                } else {
                                    that.userInfo = u;
                                    iinlist = true;
                                }
                            }
                        }
                        //for (var j = t.length; j < 50; j++) {
                        //    var fake = {};
                        //    fake.Rank = j + 1;
                        //    fake.Nickname = "Bot No." + parseInt(Math.random() * 100);
                        //    fake.WinRate = (5 / j).toFixed(2) + "%";
                        //    t.push(fake);
                        //}
                        that.ranklists = t;
                        if (!iinlist) {
                            that.userInfo = {
                                Rank: "50以下",
                                WinRate: "-"
                            }
                        }
                        that.isLoading = false;
                    } else {
                        that.ranklists = [];
                        that.isLoading = false;
                    }
                }, function () {
                    that.ranklists = [];
                    that.isLoading = false;
                });
            },
            ShowWeek: function () {
                this.isShowWeek = true;
                this.GetData();
            },
            ShowMonth: function () {
                this.isShowWeek = false;
                this.GetData();
            }
        }
    });
    return ranking;
});