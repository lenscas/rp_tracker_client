codeHandler.registerPageCode({
	dependencies  : ["modifierFormHelper"],
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
				that.characterData = data;
				let tableData = {
					head : {
						row      : ["Name"],
						cssClass : "table table-striped"
					},
					rows : []
				}
				that.config.statSheet.forEach(
					value=>tableData.head.row.push(
						{
							text : value.name,
							//data is not yet supported.
							//however using it shouldn't break anything
							//and we can use this later before creating the table
							data : {name:"mod-type-id",value:value.id},
						}
					)
				);
				data.characters.forEach(value=>{
					let row = [];
					tableData.head.row.forEach(headData =>{
						if(typeof(headData)==="string"){
							row.push(
								htmlGen.createLink(
									false,
									{
										href : that.baseUrl+"characters/"+value.code,
										text : value.name,
										
									}
								)
							);
						} else {
							row.push(
								{
									cssClass  : "characterListModifierCell",
									data      : {
										name  : "mod-type-id",
										value : headData.data.value
									},
									content   : that.findCorrectMods(
										value.code,
										headData.data.value,
									//	data.modifiers
									)
								}
								
							);
						}
					});
					tableData.rows.push({
						data : {
							name  : "character-code",
							value : value.code
						},
						row : row
					});
				});
				htmlGen.createTable(
					$(that.idPrefix+"CharContainer").empty(), 
					tableData
				).dataTable();
				that.bindCharacterEvents();
			}
		})
	},
	findCorrectMods : function(charCode,modTypeId,asArray=false){
		let total=0;
		if(asArray){
			total = [];
		}
		this.characterData.modifiers.forEach(mod=>{
			if(mod.code==charCode && mod.statId==modTypeId){
				if(asArray){
					total.push(mod);
				} else {
					total = total + Number(mod.value)
				}
				
			}
		});
		if(!asArray){
			total = total.toString();
		}
		return total;
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
				let tableData = {
					head : {
						row : ["Character","Ability","countDown","cooldown"],
						cssClass : "table"
					},
					rows : []
				}
				data.forEach(
					value => tableData.rows.push(
						[
							value.name,
							value.abilityName,
							value.countDown,
							value.cooldown
						]
				));
				htmlGen.createTable(
					$(that.idPrefix+"AbilityContainer").empty(),
					tableData
				).dataTable();
			}
		})
	},
	bindCharacterEvents: function(){
		if(!this.config.isGM){
			console.log("not a gm");
			return;
		}
		//*
		let that = this;
		$(".characterListModifierCell").on("click",function(event){
			const el = $(this);
			const modId    = el.data("mod-type-id");
			const charCode = el.closest("tr").data("character-code");
			const modList  = that.findCorrectMods(charCode,modId,true);
			const modal    = that.idPrefix+"ModifierModal";
			const formHelper = new modFormHelper(
				{
					rpCode   : that.rpCode,
					modList  : modList,
					charCode : charCode,
					statId   : modId,
					callBack : function(){
						$(modal).modal('hide');
						codeHandler.rerun();
					}
				}
			);
			formHelper.createForm({
				container : that.idPrefix+"ModifierModalBody",
				modal     : modal,
				
			});
		});
	}
})
