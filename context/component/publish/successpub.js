/*
 发布成功 
*/

(function(w,fun){
	if(w.component == null) {
		w.component = {};
	}
	w.component['successpub'] = fun(w);
})(window,function(w) {
	var failhtml = '<div class="shadow betsuccess successpub">\
				<div class="successpane">\
					<div class="messagetitle yellow"><span>发布成功</span><i class="block wgicon icon_close" @click="CloseMessage()"> </i></div>\
					<div class="matchlist">\
						<div class = "bgimg">\
						</div>\
						<div class = "message">您所选的比赛已发布成功</div>\
					</div>\
				</div>\
	 </div>';
	var successpub=Vue.extend({
	    template: failhtml,
	    name: "successpub",
		props:[],
		data:function(){
			return {}
		},
		methods:{
			//关闭弹框 0:确认发布 1:发布成功 2:发布失败
			CloseMessage:function(){
				this.$emit("CloseMessagePub",1);
			}
		}
	})
	return successpub;
});
