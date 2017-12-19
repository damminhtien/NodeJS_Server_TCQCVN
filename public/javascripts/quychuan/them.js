$(document).ready(()=>{
	setInterval(()=>{
		if($("input[name=file]").val() != ""){
			if($("input[name=ten]").val() != "" && $("input[name=quyetdinhso]").val() != "" ){
				if($("input[name=ngaybanhanh]").val() != ""){
					$("#btnSubmit").prop("disabled",false);
				}
			}	
		}		
	},50);
})