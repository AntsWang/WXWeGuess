(function (w, fun) {
    if (w.component == null) {
        w.component = {};
    }
    w.component['rule'] = fun(w);
})(window, function (w) {
    var rule = Vue.extend({
        template: "#rule",
        methods: {
            
        },
        mounted: function () { //初始化
            document.body.style.height = "100%";
            document.getElementById("sport").style.height = "100%";
        }
    });
    return rule;
});