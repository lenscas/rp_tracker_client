//this is used to manipulate the menu on the left side
menuManger = {
	menuContainer : $("#sidebarNav"),
	menuItems     : $(".menuItem"),
	//the code of the current rp. This is used for the rp specific links in the menu
	currentRP     : null,
	//the name of the current rp.
	currentName   : null,
	hasJoined     : false,
	//used to set what rp the rp specific links link to
	//the name parameter doesn't need to be given
	setWatchingRP : function(newRP,name,hasJoined){
		if(newRP === this.currentRP){
			return;
		}
		this.currentRP = newRP
		//if a name is given, set that else get the name
		if(name && hasJoined){
			this.setName(name,hasJoined);
			return;
		}
		api.get({
			url      : "rp/"+newRP,
			callBack : xhr => {
				//if the response was indeed in JSON, set the name.
				const data = xhr.responseJSON.data;
				this.setName(data.name,data.isJoined);
			}
		})
	},
	//this function sets the name and redraws the menu
	setName  : function(name,hasJoined){
		this.currentName = name;
		this.hasJoined   = hasJoined==="1";
		this.drawMenu();
	},
	setHasJoined :function(hasJoined){
		this.hasJoined=hasJoined;
		this.drawMenu();
	},
	//this function redraws the menu.
	drawMenu : function(){
		if(this.currentRP==null){
			this.menuItems.hide();
			return;
		} else {
			this.menuItems.show();
			const that = this;
			this.menuItems.each(function(){
				const el = $(this);
				const baseLink = el.data("link");
				el.attr("href",conf.base_url+"rp/"+that.currentRP+"/"+baseLink);
				if(el.hasClass("joinLink")){
					if(that.hasJoined){
						el.html("Create character");
					} else {
						el.html("Join");
					}
					el.attr("href",conf.base_url+"create/character/"+that.currentRP);
				}else if(el.hasClass("createBattle")){
					el.attr("href",conf.base_url+"create/battle/"+that.currentRP);
				}
			})
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
	},
	
}
menuManger.drawMenu();

//this binds an event to the links in the menu that way they will always point to the correct rp
menuManger.menuItems.on("click",function(event){
	event.preventDefault();
	//if no rp is set, do nothing
	if( !menuManger.currentRP){
		return;
	}
	const el = $(this);
	if(el.hasClass("joinLink")){
		if(!menuManger.hasJoined){
			api.get({
				url : "rp/"+menuManger.currentRP+"/join",
				callBack : (xhr,status)=>{
					console.log("test");
					if(status!=="success"){
						return;
					} else {
						const data = xhr.responseJSON.data;
						if(data.isJoined=="1"){
							menuManger.setHasJoined(true);
							pageHandler.goTo(el.attr("href"));
						} else {
							alertManager.show("Something went wrong.");
						}
						
					}
				}
			})
			return;
		}
	}
	pageHandler.goTo(el.attr("href"));
})
