var page = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        $('#buttonBt').click(function(){
            location.href = 'button.html';
        });
    }
};
