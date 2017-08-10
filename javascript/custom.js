$( document ).ready(function() {
 setTimeout(function(){
  $(".wrapper").each(function() {
		$(this).find(".lable-opener").click(function() {
			$(this).parent().toggleClass('open');
		});
	});	
}, 1500);

});
