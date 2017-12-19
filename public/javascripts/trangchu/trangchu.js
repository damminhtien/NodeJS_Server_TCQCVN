$("document").ready(() => {
    (async function() {
        $.ajax({
            url: "tintuc/get8maxngaydang/0",
            type: "GET",
            success: function(data) {
                $("#imgSlide0").prop("src", "images/" + data[0].urlanh);
                $("#aSlide0").prop("href", "./tintuc/xem/" + data[0].id);
                $("#aSlide0").html(data[0].ten);
                $("#atomtat0").prop("href", "./tintuc/xem/" + data[0].id);
                for (var i = 1; i < 8; i++) {
                    $("#imgSlide" + i).prop("src", "images/" + data[i].urlanh);
                    $("#aSlide" + i).prop("href", "./tintuc/xem/" + data[i].id);
                    $("#atomtat" + i).prop("href", "./tintuc/xem/" + data[i].id);
                    $("#aSlide" + i).html(data[i].ten);
                    if (i < 5) {
                        if (data[i].tomtat.length > 74) {
                            var l = 74;
                            while (data[i].tomtat[l] != " ") l--;
                            var tomtat = data[i].tomtat.substring(0, l) + "...";
                        } else var tomtat = data[i].tomtat;
                        $("#tomtat" + i).html(tomtat);
                    } else {
                        if (data[i].tomtat.length > 180) {
                            var l = 180;
                            while (data[i].tomtat[l] != " ") l--;
                            var tomtat = data[i].tomtat.substring(0, l) + "...";
                        } else var tomtat = data[i].tomtat;
                        $("#tomtat" + i).html(tomtat);
                    }

                }
            }
        });
    })();
    setInterval(() => {
        for (var i = 0; i <= 4; i++) {
            if ($(".item:eq(" + i + ")").hasClass("active")) {
                $("#tomtat" + i).css({ "background": "#dedede", "font-weight": "700", "font-size": "13px" });
            } else $("#tomtat" + i).css({ "background": "#ffffff", "font-weight": "500", "color": "black" });
        }
    }, 50);
    setInterval(getTimeNow, 50);
    $("#tra_cuu").click(
        function() {
            if ($("#form_tra_cuu").css('display') == 'none') {
                $("#form_tra_cuu").slideDown();
                $("#space").show();
            } else {
                $("#form_tra_cuu ").slideUp();
                $("#space").hide();
            }
        }
    );
});

function getTimeNow() {
    var now = new Date();
    var weekday = new Array(7);
    weekday[0] = "Chủ nhật";
    weekday[1] = "Thứ hai";
    weekday[2] = "Thứ ba";
    weekday[3] = "Thứ tư";
    weekday[4] = "Thứ năm";
    weekday[5] = "Thứ sáu";
    weekday[6] = "Thứ bảy";
    var day = weekday[now.getDay()];
    $("#timeNow").html(day + " , " + now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear());
}