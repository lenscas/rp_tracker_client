simpleEvents = {
	togglePanelShow : function(selector,on){
		on = on || "click";
		$(selector).on(on,function(event){
			if(event.isDefaultPrevented()){
				return;
			}
			event.preventDefault();
			$(this).children(".panel-body").toggle();
		})
	}
	
}
