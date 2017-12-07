(function(w, fun) {
	if(w.component == null) {
		w.component = {};
	}
	w.component['datebar'] = fun(w);
})(window, function(w) {
	var datebarhtml = '<div class="datebar">\
		<sportbox :sportId=sportId  class="sportbox fourDiv floatleft" @ChangeSport=ChangeSport></sportbox>\
		<div class="showdate twoDiv floatleft verticalcenter">\
		<a :class="{\'beforeAble\':(this.currentIndex>0),\'beforedate\':(this.currentIndex<=0)}" @click="BeforeDate()"></a>\
		<span class="blue" v-if="datelist[currentIndex]">({{datelist[currentIndex].day}}){{datelist[currentIndex].date}}</span>\
		<a :class="{\'nextAble\':(this.currentIndex<dateLength),\'nextdate\':(this.currentIndex>=dateLength)}" @click="NextDate()" ></a>\
		</div>\
		<a class="calendar fourDiv floatright" @click="ShowCaledener()"></a>\
		<calendar v-if="isShowCalendar" :datelist=datelist :currentindex=currentIndex @SelectDate=SelectDate @CloseCalendar=CloseCalendar></calendar>\
	</div>';
	var datebar = Vue.extend({
		template: datebarhtml,
		props: ["sportId", "currentDate", "datelist"],
		data: function() {
			var index = 0;
			if(this.datelist instanceof Array && this.currentDate) {
				for(var i = 0; i < this.datelist.length; i++) {
					if(this.datelist[i].date == this.currentDate) {
						index = i;
						break;
					}
				}
			}
			return {
				isShowCalendar: false,
				currentIndex: index
			}
		},
		components: {
			sportbox: w.component.sportbox,
			calendar: w.component.calendar
		},
		computed: {
			dateLength: function() {
				if(this.datelist) {
					return this.datelist.length - 1;
				}
				return 0;
			}

		},
		methods: {

			//前一天
			BeforeDate: function() {
				if(this.currentIndex <= 0) {
					return;
				}
				this.currentIndex--;
				this.$emit("ChangeDate", this.datelist[this.currentIndex].date)
			},
			//后一天
			NextDate: function() {
				if(this.currentIndex >= this.dateLength) {
					return;
				}
				this.currentIndex++;
				this.$emit("ChangeDate", this.datelist[this.currentIndex].date)
			},
			//显示日历
			ShowCaledener: function() {
				this.isShowCalendar = !this.isShowCalendar;
				this.$emit("ShowCaledener",this.isShowCalendar);
			},
            CloseCalendar:function() {
                this.isShowCalendar = false;
                this.$emit("ShowCaledener", this.isShowCalendar);
            },
			//日历选择器变更时间
			SelectDate: function(index) {
				this.currentIndex = index;
				var li = this;
				setTimeout(function() {
					li.isShowCalendar = false;
				}, 500)
				this.$emit("ChangeDate", this.datelist[this.currentIndex].date)
			},
			//变更运动
			ChangeSport: function(sportId) {
				this.$emit("ChangeSport", sportId)
			}
		}
	})
	return datebar;
});