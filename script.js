$('.tab').on('click', function(){
	$('.tab_box .tab_content').hide();
	$('.tab').toggleClass('active', false);
	$(this).toggleClass('active', true);
	$('.tab_box .tab_content[data-tabid="' + $('.tab_title', this).data('tabidp') + '"]').show();
});