codeHandler.registerPageCode({
	dependencies  : ["characterTableHelper","abilityTableHelper"],
	depsHTML      : ["modal"],
	baseUrl  : "",
	idPrefix : "#charList",
	once     : function(){
		console.log("characters once");
	},
	startUp  : function(params){
		console.log("characters startup");
		const that     = this;
		const rpCode   = params[0];
		this.baseUrl   = "rp/"+rpCode+"/";
		this.rpCode    = rpCode
		api.get({
			url : this.baseUrl+"config",
			callBack : (xhr,status) =>{
				if(status!=="success"){
					return;
				}
				that.config = xhr.responseJSON.data
				that.fillCharacters();
				that.fillAbilities();
				
			}
		})
	},
	fillCharacters : function(){
		const that = this;
		api.get({
			url : this.baseUrl+"characters",
			callBack : function(xhr,status){
				if(status!=="success"){
					return;
				}
				
				const data =xhr.responseJSON;
				console.log(data);
				const characterTable = new CharacterFormHelper({
					characters : data.characters,
					modifiers  : data.modifiers,
					container  : $(that.idPrefix+"CharContainer").empty(),
					config     : that.config,
					modal      : "#modal",
					rpCode     : that.rpCode,
				});
				characterTable.createTable();
			}
		})
	},
	fillAbilities : function(){
		const that = this;
		api.get({
			url : this.baseUrl+"abilities",
			callBack : function(xhr,status){
				if(status!=="success"){
					return;
				}
				const data = xhr.responseJSON;
				abilityTable = new AbilityTableHelper({
					abilities : data,
					container : $("#charListAbilityContainer").empty()
				});
				abilityTable.createTable();
			}
		})
	},
})
