/*
 * 消息提示
 * 
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['notice'] = fun(w);
})(window, function (w) {
    var noticehtml = '<div notice id="notice" class="contain"></div>';
    var notice = Vue.extend({
        template: noticehtml,
        name: "notice",
        data: function () {
            return {
            }
        },
        components: {
            
        },
        mounted: function () {
           $Notification.start(w.Api.options.NoticeUrl,"notice");
        },
        methods: {
             
        }
    });
    return notice;
});