var page = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        $('#codeBt').click(function(){
            location.href = 'code.html';
        });
    }
};
