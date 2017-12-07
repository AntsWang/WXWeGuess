(function(w,fun){
	if(typeof(fun)=="function"){
		w.Language=fun();
	}
})(window,function(){
	var lang={
		 LoadingText:{//
        	LoadData:"加载数据",
        	LoadGetBet:"获取投注",
        	LoadBet:"正在下单"
       },
       DayList:["周天","周一","周二","周三","周四","周五","周六"]
	}
	return lang;
});
