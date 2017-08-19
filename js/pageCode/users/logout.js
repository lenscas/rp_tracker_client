codeHandler.registerPageCode({
	startUp : function(){
		api.get({
			url : "/logout",
			callBack : function(xhr,status){
				if(status!=="success"){
					return;
				}
				const data = xhr.responseJSON.data;
				if(data.success){
					alertManager.show("You are successfully logged out.","success");
					header.setUserId(null);
					menuManger.hideMenu();
				} else {
					alertManager.show(data.error);
				}
			}
		})
	}
})
