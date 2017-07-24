console.log("test2")
pageHandler.registerPageCode({
	bindEvents : function(){
		$("#loginForm").on("submit",function(event){
			event.preventDefault();
			api.post({
				url  : "login",
				data : $(this).serialize(),
				callBack : function(xhr,status){
					let json = xhr.responseJSON
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
		console.log("wtf?!");
		console.log($("#loginForm"));
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
	}
});
