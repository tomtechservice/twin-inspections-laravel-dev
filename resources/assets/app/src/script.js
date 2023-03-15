toggleSidebar = function(){
	if ($('.sidebar').hasClass('fliph')) {
        $('#sidebar-collapse > i').attr('class', 'fa fa-angle-double-right');
    } else {
        $('#sidebar-collapse > i').attr('class', 'fa fa-angle-double-left');
    }
}
$(document).ready(function(){
   	$('#sidebar-collapse').click(function(){
       	$('.sidebar').toggleClass('fliph');
       	toggleSidebar();
   	});
   	toggleSidebar();
     
});