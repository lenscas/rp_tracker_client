menuManger = {
	menuContainer : $("#sidebarNav"),
	menuItems     : $(".menuItem");
	currentRP     : null,
	setWatchingRP : function(newRP){
		this.currentRP = newRP
		this.drawMenu();
	}
	drawMenu      : function(){
		if(currentRP==null){
			menuItems.hide();
			return;
		} else {
			menuItems.show();
		}
		menuContainer.find("#menuRPName").html(this.currentRP.name);
	}
	hideMenu : function(){
		this.menuContainer.hide();
	}
	showMenu : function(){
		this.menuContainer.show();
	}
}
menuManger.menuItems.on("click",function(event){
	event.preventDefault();
	if( !menuManger.currentRP){
		return;
	}
	const el  = $(this);
	const url = conf.base_url+"rp/"+menuManger.currentRP+"/"+el.attr("href");
	pageHandler.goTo(url);
})
