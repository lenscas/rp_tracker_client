pageHandler.registerPageCode({
	bindEvents : function(){
		$("#awesome").on("click",function(){
			api.post({
				url  : "login",
				data : {username : "root", password : "root"},
				callBack : function(xhr,status){
					if(status=="success" && xhr.responceJSON.error){
						pageHandler.enablePage("index");
					}
				}
			});
		});
		$("#logout").on("click",function(){
			api.post({ url :"logout"})
		});
	},
	startUp : function(){
		console.log("I AM STARTED!");
	}
});
