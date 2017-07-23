pageHandler.registerPageCode({
	startUp : function(pageParams){
		let that = this;
		api.get({
			url      : "rp/"+pageParams[0],
			callBack : function (xhr,status){
				console.log("still in callback");
				console.log(xhr);
			}
		})
	}
})
