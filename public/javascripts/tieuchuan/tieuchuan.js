$(document).ready(()=>{
	$('#bomonSelect').on('change', function() {
    	$('#idcttSelect').empty();
        if(this.val() == 1){
        	$('#idcttSelect').append('<option value="1">Yêu cầu chung</option>');
        	$('#idcttSelect').append('<option value="2">Tiêu chuẩn về nhà ở</option>');
        	$('#idcttSelect').append('<option value="3">Công trình công cộng</option>');
        	$('#idcttSelect').append('<option value="4">Hệ thống kỹ thuật trong nhà và công trình</option>');
        }
        else if(this.val() == 2){
        	$('#idcttSelect').append('<option value="1">Quy hoạch xây dựng</option>');
        	$('#idcttSelect').append('<option value="2">Nhà ở và công trình công cộng</option>');
        	$('#idcttSelect').append('<option value="3">Công trình cộng nghiệp</option>');
        	$('#idcttSelect').append('<option value="4">Môi trường phát triển bền vững</option>');
        }
        else if(this.val() == 3){
        	$('#idcttSelect').append('<option value="1">Khảo sát xây dựng</option>');
        	$('#idcttSelect').append('<option value="2">Đo đạc trong xây dựng</option>');
        }
        else if(this.val() == 4){
        	$('#idcttSelect').append('<option value="1">Những vấn đề chung</option>');
        	$('#idcttSelect').append('<option value="2">Tải trọng và tác động</option>');
        	$('#idcttSelect').append('<option value="3">Kết cấu bê tông cốt thép</option>');
        	$('#idcttSelect').append('<option value="4">Kết cấu thép</option>');
        	$('#idcttSelect').append('<option value="5">Kết cấu liên hợp</option>');
        	$('#idcttSelect').append('<option value="6">Kết cấu gạch đá khối xây, gỗ</option>');
        	$('#idcttSelect').append('<option value="7">Kết cấu nhôm</option>');
        	$('#idcttSelect').append('<option value="8">Kết cấu nền và móng</option>');
        }
        else if(this.val() == 5){
        	
        }
        else if(this.val() == 6){
        	
        }
    });
});