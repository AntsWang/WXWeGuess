/*
 *确认发布
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['confirmpub'] = fun(w);
})(window, function (w) {
    var confirmpubhtml = '<div class="shadow betsuccess conpub">\
				<div class="successpane">\
					<div class="matchlist">\
					  <div class = "rowwraper">\
						<div class  = "row1" v-for = "item in publishList.Items">\
						   <div class = "time">\
						      <span>{{month}}</span>\
						      <span>{{time}}</span>\
						   </div>\
						   <div class = "home textCut">{{item.HomeName}}</div>\
						   <div class = "vsa">VS</div>\
						   <div class  = "away textCut">{{publishList.Items[0].AwayName}}</div>\
						</div>\
					  </div>\
						<div class = "row2">立即发布该场比赛推荐</div>\
					</div>\
					<div class="messagebtn publishfooter"><a class="block floatleft twoDiv" @click="CloseMessage()">返回</a><a class="block floatleft  twoDiv blue" @click="ConfirmPub()">确定</a></div>\
				</div>\
	 </div>';
    var confirmpub = Vue.extend({
        template: confirmpubhtml,
        name: "confirmpub",
        props:['publishList'],//该场比赛详情
        computed:{
        	//格式化日期
        	month:function(){
        		 var ymd = this.publishList.BetDate.split(" ")[0].split('/');
        		 return ymd[1]+'/'+ymd[2];
        	},
        	//格式化日期
        	time:function(){
        		 var ymd = this.publishList.BetDate.split(" ")[1].split(':');
        		 return ymd[0]+':'+ymd[1];
        	},
        	//获取注单ID
        	betId:function(){
        		return this.publishList.BetID;
        	}
        },
        data:function(){
                return {
                	
                }
        },
        created:function(){
        	console.log(this.publishList);
        },
        methods:{
        	//关闭弹窗
        	CloseMessage:function(){
				this.$emit("CloseMessagePub",0);
			},
			//确认发布
			ConfirmPub: function () {
				this.$emit("ConfirmPub",this.betId);
/*                var that = this;
                that.$emit('ShowLoad',true);
                var params = {BetID:this.betId}
                w.Api.PublishBet(params, function (data) {
                	  that.$emit('ShowLoad',false);
                	  that.$emit("CloseMessagePub",0);
                      var msg = data.Result;
                      if(msg == 1){
                      	that.$emit('ShowSuccessPub');
                      	return
                      }else{
                      	var text = w.$config.PublishMsg[msg];
                      	that.$emit('ShowFailPub',text);
                        console.log(msg+"====="+text);
                      }
                      
                }, function (err) {
                      console.log(err);
                });*/
            }
        	
        }
    });
    return confirmpub;
});