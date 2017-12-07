(function(w,fun){
	if(w.component == null) {
		w.component = {};
	}
	w.component['betfail'] = fun(w);
})(window,function(w) {
    var failhtml = '<div class="shadow betfail">\
				<div class="messagepane">\
					<div class="messagetitle blue"><span>投注失败</span><i class="floatright block wgicon icon_close" @click="CloseMessage()"> </i></div>\
					<div class="message"><p class="msg">{{betErrormsg}}<p></div>\
					<div v-if="type==2" class="messagebtn"><a class="block floatleft twoDiv blue" @click="JoinActivity()"><span>参与活动</span></a><a class="block floatleft  twoDiv blue" @click="ImRecharge()"><span>立即充值</span></a></div>\
					<div v-if="type==3" class="messagebtn"><a class="block floatleft twoDiv blue" @click="ReSubmitBet()"><span>确定</span></a><a class="block floatleft  twoDiv blue" @click="CancelBet()"><span>取消</span></a></div>\
				</div>\
	 </div>';
	var fail=Vue.extend({
		template:failhtml,
		props:["type","betErrormsg"],
		data:function(){
			return {}
		},
		methods:{
			CloseMessage:function(){
				this.$emit("CloseMessage");
			},
			//再次投注
			ReSubmitBet:function(){
				this.$emit("ReSubmitBet");
			},
			//取消重新投注
			CancelBet:function(){
				this.$emit("CancelBet");
			},
			//立即充值
			ImRecharge:function(){
                alert("立即充值");
			},
			//参与活动
			JoinActivity:function(){
				alert("参与活动");
                // this.$router.push({
                //     name: '',
                //     params: {
                       
                //     }
                // });
			}
		}
	})
	return fail;
});
