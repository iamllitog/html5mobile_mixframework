var page = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        $('#tableBt').click(function(){
            location.href = 'table.html';
        });
    }
};