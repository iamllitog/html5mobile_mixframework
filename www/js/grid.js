
var page = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        $('#typesettingBt').click(function(){
            location.href = 'typesetting.html';
        });
    }
};
