/*
  信息提示---已发布 
*/

(function(w,fun){
	if(w.component == null) {
		w.component = {};
	}
	w.component['messagepub'] = fun(w);
})(window,function(w) {
	var failhtml = '<div class="shadow betsuccess messagepub">\
				<div class="successpane">\
					<div class="messagetitle yellow"><span>提示</span><i class="block wgicon icon_close" @click="CloseMessage()"> </i></div>\
					<div class="matchlist">{{errMsg}}</div>\
				</div>\
	 </div>';
	var messagepub=Vue.extend({
		template:failhtml,
		props: ['errMsg'],
		name:"messagepub",
		data:function(){
			return {}
		},
		methods:{
			//关闭弹框 0:确认发布 1:发布成功 2:发布失败
			CloseMessage:function(){
				this.$emit("CloseMessagePub",2);
			}
		}
	})
	return messagepub;
});
