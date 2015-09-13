$(document).ready(function(){
    $('.js-delete-content').click(function(){
        var source = $("#content-delete-template").html();
        var template = Handlebars.compile(source);
        var context = {title: $(this).data('title'), id: $(this).data('id')};
        var html = template(context);
        $.featherlight(html, {
            type: 'html'
        });
    });
});