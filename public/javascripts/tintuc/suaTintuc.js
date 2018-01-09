tinymce.init({
    selector: '#mytextarea',
    height: 500,
    theme: 'modern',
    plugins: 'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help code',
    toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | image code',
    image_advtab: true,
    templates: [
        { title: 'Test template 1', content: 'Test 1' },
        { title: 'Test template 2', content: 'Test 2' }
    ]
});

function getRequests() {
    var id = location.href.split("/");
    return id[id.length-1];
};

$('document').ready(() => {
    (async function() {
        $.ajax({
            url: "/tintuc/thongtin/" + getRequests(),
            type: "GET",
            success: function(data) {
                if (data != undefined) {
                    tinyMCE.activeEditor.setContent(data.noidung);
                } else {
                    tinyMCE.activeEditor.setContent("");
                }
            }
        });
    })();
});
