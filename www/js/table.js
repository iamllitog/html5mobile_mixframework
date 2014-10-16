var page = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        $('#formBt').click(function(){
            location.href = 'form.html';
        });
    }
};
