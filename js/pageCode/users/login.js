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
						pageHandler.goTo("profile/"+json.userId);
					}
				}
			});
		});
		$("#logout").on("click",function(){
			api.post({ url :"logout"})
		});
	},
	startUp : function(){
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
