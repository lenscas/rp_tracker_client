simpleEvents = {
	togglePanelShow : function(selector,on){
		$(selector).on(on,function(event){
			if(event.isDefaultPrevented()){
				return;
			}
			event.preventDefault();
			$(this).children(".panel-body").toggle();
		})
	}
	
}
