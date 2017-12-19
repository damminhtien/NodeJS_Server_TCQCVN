$(document).ready(() => {
    $("#admin").click(() => {
        $("#iframe").prop("src","/admin/quanly/admin");
    });
    $("#quychuan").click(() => {
        $("#iframe").prop("src","/admin/quanly/quychuan");
    });
    $("#nguoidung").click(() => {
        $("#iframe").prop("src","/admin/quanly/nguoidung");
    });
    $("#duthao").click(() => {
        $("#iframe").prop("src","/admin/quanly/duthao");
    });
    $("#gioithieu").click(() => {
        $("#iframe").prop("src","/admin/quanly/gioithieu");
    });
    $("#tieuchuan").click(() => {
        $("#iframe").prop("src","/admin/quanly/tieuchuan");
    });
    $("#tintuc").click(() => {
        $("#iframe").prop("src","/admin/quanly/tintuc");
    });
    $("#thongbao").click(() => {
        $("#iframe").prop("src","/admin/quanly/thongbao");
    });
});