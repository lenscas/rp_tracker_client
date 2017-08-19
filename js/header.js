header = {
	userId  : null,
	elClass : ".headerLink",
	setUserId : function(userId){
		if(this.userId===userId){
			return;
		}
		this.userId = userId
		if(userId==null){
			$(this.elClass).hide();
			$(".showLoggedIn").hide();
			$(".showLoggedOut").show();
		} else {
			const href  = conf.base_url+"profile/"+this.userId;
			$("#profileLink").attr("href",href);
			$(this.elClass).show();
			$(".showLoggedIn").show();
			$(".showLoggedOut").hide();
		}
	}
}
$(header.elClass).hide();
$("#loginLink").attr("href",conf.base_url+"login").show();
