codeHandler.registerPageCode({
	once :function(){
		let that =this;
		api.get({
			url : "statsheet",
			callBack : function(xhr,status){
				if(status !=="success"){
					return;
				}
				const data = xhr.responseJSON.data;
				that.inputData.inputs.forEach(
					input => input.input.type === "select" &&
						data.forEach(
							value => input.input.options.push(
								{
									value : value.code,
									text  : value.name
								}
							)
						)
				);
				console.log(that);
				htmlGen.createForm("#createRPForm",that.inputData);
			}
		})
	},
	inputData : {
		inputs : [
			{
				label : "Roleplay name",
				input : {type : "text",name : "name"}
			},
			{
				label : "Maximum stats",
				input : {type : "number",name : "startingStatAmount"}
			},
			{
				label : "Maximum abilities",
				input : {type : "number",name : "startingAbilityAmount"}
			},
			{
			label : "Stat sheet",
			input : {
				type    : "select",
				name    : "statSheetCode",
				options : []
			}
		},
			{
				label : "description",
				input : {type:"textarea",name:"description"}
			}
		],
		button : {color : "success",text  : "Create"}
	},
	bindEvents : function(){
		$("#createRPForm").on("submit",function(event){
			event.preventDefault();
			api.post({
				url  : "rp",
				data : $(this).serialize(),
				callBack : function(xhr,status){
					let json = xhr.responseJSON;
					if(status=="success" && !json.error){
						let location =xhr.getResponseHeader("location")
						location = location.replace(conf.api,"");
						pageHandler.goTo(conf.base_url+location);
					}
				}
			});
		});
	}
})
