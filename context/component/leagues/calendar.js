(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['calendar'] = fun(w);
})(window, function (w) {
    var calendarhtml = '<div class="calendarPane verticalcenter shadow" @click.self="Close()">\
						<div class="sprite">\
							<div class="topitools itools">*</div>\
							<a v-for="(date,index) in datelist" :class="{\'selestdate\':currentindex==index}" @click="SelectDate(index)">{{date.date}}</a>\
							<div class="dowitools  itools">*</div>\
						</div>\
					</div>';
    var calendar = Vue.extend({
        template: calendarhtml,
        props: ["datelist", "currentindex"],
        data: function () {
            return {}
        },
        mounted: function () {
            //将选中的项目滚动到对话框中间
            var sp = document.getElementsByClassName("sprite")[0];
            var sele = document.getElementsByClassName("selestdate")[0];
            sp.scrollTop = sele.offsetTop - sp.offsetTop + sele.clientHeight / 2 - sp.clientHeight / 2;
        },
        methods: {
            SelectDate: function (index) {
                this.$emit("SelectDate", index);
            },
            Close: function () {
                this.$emit("CloseCalendar");
            }
        }
    });
    return calendar;
});
