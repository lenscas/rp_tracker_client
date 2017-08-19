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
			$("#loginLink").show();
		} else {
			const href  = conf.base_url+"profile/"+this.userId;
			$("#profileLink").attr("href",href);
			$(this.elClass).show();
			$("#loginLink").hide();
		}
	}
}
$(header.elClass).hide();
$("#loginLink").attr("href",conf.base_url+"login").show();
