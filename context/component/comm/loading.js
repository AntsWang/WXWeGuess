/*
 *加载页
 */
(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['loading'] = fun(w);
})(window, function (w) {
    var loadinghtml = '<div class="shadowload loading"><div class="loading_cont">\
						<img src="context/image/loading1.gif" ></img>\
						<div class="blue"><span class="textCut">{{loadingText||"加载中"}}</span></div>\
					 </div></div>';
    var loading = Vue.extend({
        template: loadinghtml,
        props: ["loadingText"],
        name:"loading"
    });
    return loading;
});