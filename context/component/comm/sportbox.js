/*
 * 运动选择下拉列表
 */
(function(w, fun) {
	if(w.component == null) {
		w.component = {};
	}
	w.component['sportbox'] = fun(w);
})(window,function(w){
	var sporthtml='<div>\
					<a class="selectsport block" @click="ChangeShow()"><span class="icon" :class="{\'footballselect\':(sportId==1),\'basketballselect\':(sportId==2),\'gamingselect\':(sportId==3)}"></span><span class="icon" :class="{\'showup\':showlist,\'hidedown\':!showlist}"></span></a>\
					<div class="sportpane" v-show="showlist">\
						<a class="selectsport block" v-for="(item,index) in Filterlist()" @click="ChangeSport(item.SportId)">\
						<span class="icon"  :class="{\'football\':(item.SportId==1),\'basketball\':(item.SportId==2),\'gaming\':(item.SportId==3)}"></span>\
						</a>\
					</div>\
				</div>'
	var sport=Vue.extend({
		template:sporthtml,
		props:["sportId"],
		data:function(){
			return {
				list:[{"SportId":1,"SportName":"足球"},{"SportId":2,"SportName":"篮球"},{"SportId":3,"SportName":"竞猜"}],
				showlist:false
			}
		},
		methods:{
			Filterlist:function(){
				var arr=[];
				var id=this.sportId;
				this.list.forEach(function(item,index){
					if(item.SportId!=id){
						arr.push(item);
					}
				})
				return arr;
			},
			ChangeShow:function(){
				this.showlist=!this.showlist;
			},
			ChangeSport:function(sportId,type){
				this.showlist=false;
				//this.sportId=sportId;
				this.$emit("ChangeSport",sportId);
			},
			InitBox:function(){
				this.sportId=1;
			}
		}
	})
	return sport;
});
