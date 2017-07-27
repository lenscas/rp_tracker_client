menuManger = {
	menuContainer : $("#sidebarNav"),
	menuItems     : $(".menuItem"),
	currentRP     : null,
	currentName   : null,
	setWatchingRP : function(newRP,name){
		if(newRP === this.currentRP){
			return;
		}
		this.currentRP = newRP
		if(name){
			this.setName(name);
			return;
		}
		let that = this
		api.get({
			url      : "rp/"+newRP,
			callBack : xhr => {
				console.log("in callback");
				console.log(xhr);
				xhr.responseJSON 
				&& that.setName(xhr.responseJSON.name)
			}
		})
	},
	setName  : function(name){
		console.log("the name is "+ name);
		this.currentName = name;
		console.log(this);
		this.drawMenu();
	},
	drawMenu : function(){
		console.log(this);
		if(this.currentRP==null){
			this.menuItems.hide();
			return;
		} else {
			this.menuItems.show();
		}
		console.log(this.menuContainer.find("#menuRPName"));
		console.log(this.currentName);
		this.menuContainer.find("#menuRPName").html(this.currentName);
	},
	hideMenu : function(){
		this.menuContainer.hide();
	},
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
