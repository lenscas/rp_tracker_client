codeHandler.registerPageCode({
	once : function(){
		htmlGen.createForm("#loginForm",{
			inputs : [
				{
					label : "Username",
					input : {
						type : "text",
						name : "username"
					}
				},
				{
					label : "Password",
					input : {
						type : "password",
						name : "password"
					}
				}
			],
			button : {
				color : "primary",
				text  : "login"
			}
		})
	},
	bindEvents : function(){
		$("#loginForm").on("submit",function(event){
			event.preventDefault();
			api.post({
				url  : "login",
				data : $(this).serialize(),
				callBack : function(xhr,status){
					let json = xhr.responseJSON
					menuManger.showMenu();
					if(status=="success" && !json.error){
						pageHandler.goTo(conf.base_url+"profile/"+json.userId);
					}
					if(xhr.state() === "rejected"){
						//add code to deal with already being logged in here!
						pageHandler.goTo("users/")
					}
				}
			});
		});
		$("#logout").on("click",function(){
			api.post({ url :"logout"})
		});
	},
	startUp : function(){
		menuManger.hideMenu();
		header.setUserId(null);
	}
});
