pageHandler.registerPageCode({
	baseUrl  : "",
	idPrefix : "#charList",
	startUp  : function(params){
		const that     = this;
		const rpCode   = params[0];
		this.baseUrl   = "rp/"+rpCode+"/";
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
				const data =xhr.responseJSON
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
							data : {name:"mod-type-id",value:value.id}
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
										text : value.name
									}
								)
							);
						} else {
							row.push(
								that.findCorrectMods(
									value.code,
									headData.data.value,
									data.modifiers
								)
							);
						}
					});
					tableData.rows.push(row);
				});
				htmlGen.createTable(
					$(that.idPrefix+"CharContainer").empty(), 
					tableData
				).dataTable();
			}
		})
	},
	findCorrectMods : function(charCode,modTypeId,modList){
		let total=0;
		modList.forEach(mod=>{
			if(mod.code==charCode && mod.statId==modTypeId){
				total = total + Number(mod.value)
			}
		});
		return total
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
	}
})
