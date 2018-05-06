header = {
	userId  : null,
	elClass : ".headerLink",
	setUserId : function(userId){
		if(this.userId===userId){
			return;
		}
		this.userId = userId
		if(userId!=null){
			const href  = conf.base_url+"profile/"+this.userId;
			$("#profileLink").attr("href",href);
		}
		this.renderLinks();
	},
	renderLinks : function(){
		if(this.userId){
			$(".showLoggedIn").show();
			$(".showLoggedOut").hide();
			if(typeof alerts==='undefined'){
				codeHandler.loadDependencies(["alerts"],
					()=>alerts.init(()=>{})
				);
			}
			
		} else {
			$(".showLoggedIn").hide();
			$(".showLoggedOut").show();
		}
	}
}
header.renderLinks()
