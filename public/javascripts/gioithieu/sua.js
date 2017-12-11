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
     ],
     content_css: [
         '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i'
     ]
 });
 $('document').ready(() => {
     setInterval(checkTxtId, 100);
 });

 var oldId, newId;

 function checkTxtId() {
     oldId = newId;
     newId = $('#gioithieuId').val();
     if (newId != oldId) {
         (async function() {
             $.ajax({
                 url: "./thongtin/" + newId,
                 type: "GET",
                 success: function(data) {
                     if (data != undefined) {
                         tinyMCE.activeEditor.setContent(data.chude);
                     } else {
                         console.log("$('input[name=ten]').val()");
                         tinyMCE.activeEditor.setContent("");
                     }
                 }
             });
         })();
     }
 }