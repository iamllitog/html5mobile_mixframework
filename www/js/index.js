
var page = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        $('#typesettingBt').click(function(){
            location.href = 'html/typesetting.html';
        });
    }
};
