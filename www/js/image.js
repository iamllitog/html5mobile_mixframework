var page = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        $("#othercssBt").click(function(event){
            location.href = "othercss.html";
        });
    }
};
