//this is used to manipulate the menu on the left side
menuManger = {
	menuContainer : $("#sidebarNav"),
	menuItems     : $(".menuItem"),
	//the code of the current rp. This is used for the rp specific links in the menu
	currentRP     : null,
	//the name of the current rp.
	currentName   : null,
	//used to set what rp the rp specific links link to
	//the name parameter doesn't need to be given
	setWatchingRP : function(newRP,name){
		if(newRP === this.currentRP){
			return;
		}
		this.currentRP = newRP
		//if a name is given, set that else get the name
		if(name){
			this.setName(name);
			return;
		}
		let that = this
		api.get({
			url      : "rp/"+newRP,
			callBack : xhr => {
				//if the response was indeed in JSON, set the name.
				xhr.responseJSON &&
				that.setName(xhr.responseJSON.name)
			}
		})
	},
	//this function sets the name and redraws the menu
	setName  : function(name){
		this.currentName = name;
		this.drawMenu();
	},
	//this function redraws the menu.
	drawMenu : function(){
		if(this.currentRP==null){
			this.menuItems.hide();
			return;
		} else {
			this.menuItems.show();
		}
		this.menuContainer.find("#menuRPName").html(this.currentName);
	},
	//these 2 functions are used to show or hide the menu. 
	//useful for example for the login page, as there we don't want to show anything
	hideMenu : function(){
		this.menuContainer.hide();
	},
	showMenu : function(){
		this.menuContainer.show();
	}
}
//this binds an event to the links in the menu that way they will always point to the correct rp
menuManger.menuItems.on("click",function(event){
	event.preventDefault();
	//if no rp is set, do nothing
	if( !menuManger.currentRP){
		return;
	}
	const el  = $(this);
	const url = conf.base_url+"rp/"+menuManger.currentRP+"/"+el.attr("href");
	pageHandler.goTo(url);
})
