codeHandler.registerPageCode({
	form : $("#userRegisterForm"),
	once : function(){
		htmlGen.createForm(
			this.form,
			{
				inputs : [
					{
						input : {name : "username"},
						label : "Username"
					},
					{
						input : {
							name : "mail",
							type : "email"
						},
						label : "Email"
					},
					{
						input : {
							name     : "password",
							type     : "password",
							cssClass : "checkPassword"
						},
						label : "Password"
					},
					{
						input : {
							id   : "passwordCheck",
							name : "passwordCheck",
							cssClass : "checkPassword",
							type : "password"
						},
						label : "Comfirm Password"
					}
				],
				button : {
					text  : "register",
					color : "success"
				}
			}
		);
	},
	bindEvents : function(){
		console.log("eu");
		const that=this;
		this.form.on("submit",function(event){
			event.preventDefault();
			const data = $(this).serializeArray();
			api.post({
				url  : "users",
				data : data,
				callBack : (xhr,status)=>{
					if(status!=="success"){
						return;
					}
					console.log(xhr.responseJSON);
					that.form.hide();
					alertManager.show("A mail has been sent to activate the account","success");
				}
			});
			console.log(data);
		});
		this.form.find(".checkPassword").on("change",function(){
			let last;
			that.form.find(".checkPassword").each(function(){
				const el = $(this);
				const val = el.val();
				if(!last){
					last = val;
					return;
				}
				let message = "Password must match.";
				if(last===val){
					message = "";
				}
				document.getElementById("passwordCheck").setCustomValidity(message);
			});
		});
	}
})
