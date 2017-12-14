$("document").ready(() => {
    (async function() {
        $.ajax({
            url: "tintuc/get5maxngaydang",
            type: "GET",
            success: function(data) {
            	$("#imgSlide0").prop("src","images/"+data[0].urlanh);
            	$("#aSlide0").prop("href","./tintuc/xem/"+data[0].id);
            	$("#aSlide0").html(data[0].ten);
                for (var i = 1; i < 5; i++) {
                	$("#imgSlide"+i).prop("src","images/"+data[i].urlanh);
            		$("#aSlide"+i).prop("href","./tintuc/xem/"+data[i].id);
            		$("#aSlide"+i).html(data[i].ten);
            		if(data[i].tomtat.length > 94){
            			var l = 94;
            			while(data[i].tomtat[l] != " ") l--;
            			var tomtat = data[i].tomtat.substring(0,l) + "...";	
            		} 
            		else var tomtat = data[i].tomtat; 
            		$("#tomtat"+i).html(tomtat);
                }
            }
        });
    })();
    setInterval(()=>{
    	for (var i = 0; i <= 4; i++) {
    	 	if($(".item:eq("+i+")").hasClass("active")) $("#tomtat"+i).css("background","red");
    	 	else $("#tomtat"+i).css("background","white"); 
    	}
    },50);
});
