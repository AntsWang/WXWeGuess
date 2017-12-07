/*
 * 比赛列表
 * 传入参数为比赛列表
 * 
 */
(function(w, fun) {
	if(w.component == null) {
		w.component = {};
	}
	w.component['matchitem'] = fun(w);
})(window,function(w) {
    var matchhtml = '<div id="matchitem"   class="matchitem touch_scroll"><div>\
					<div v-for="(match,index) in matchlist" class="item" @click="SelectMatch(match.MID)" :key="match.MID">\
					<div class="right\">\
						<span class="stage textCut" :class="{\'yellow\':match.OL}">{{OpenLive(match.OL)}}</span>\
						<span class="guesser"><i class = "person wgicon"></i><span class="count">{{match.guesser}}999</span><i class = "wpicon right block"></i></span>\
					</div>\
					<div class="left">\
						<span v-if="Type" class = "time" ><span class=" league textCut floatleft">{{match.LN}}</span> {{MatchDate(match.MD)}}</span>\
						<span v-if="!Type" class=" textCut">{{match.MD}}</span>\
						<span class="name textCut">{{match.HN}}</span>\
						<span class="name textCut">{{match.AN}}</span>\
					</div>\
					</div><div class="no-data-tips inrightpane" v-show="!showleftpane&&matchlist.length==0">暂无数据</div>\
				</div></div>';
	var match = Vue.extend({
		template: matchhtml,
		name:"matchItem",
		props: ["matchlist", "type", "showleftpane"],
		computed:{
			Type:function(){
				if(this.type=="time"){
					return true;
				}
				return false;
			}
		},
		methods: {
			//联赛时间
			MatchDate:function(datestr){
				return datestr.substr(datestr.length-5,5);
				
			},
			//是否开滚球
			OpenLive:function(ol){
				if(ol){
					return "滚球";
				}
			    return "";
			},
			//选中比赛
			SelectMatch: function(mid) {
			    this.$emit("SelectMatch", mid);
			}
		}
	})
	return match;
});