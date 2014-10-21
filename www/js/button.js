/**
 * Created by tianjin on 14-10-21.
 */
var page = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        $('#imageBt').click(function(){
            location.href = 'image.html';
        });
    }
};
