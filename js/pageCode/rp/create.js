codeHandler.registerPageCode({
	dependencies : ["expandableInputs"],
	battleSystemSelecClass : "rpCreateSelectSystem",
	once :function(){
		this.basicFormHolder = htmlGen.createPanel("#createRPForm",{
			color : "default",
			title : "Basic",
		}).find(".panel-body");
		this.statsFormHolder = htmlGen.createPanel("#createRPForm",{
			color : "success",
			title : "Stats",
		}).find(".panel-body");
		this.actionsFormHolder = htmlGen.createPanel("#createRPForm",{
			color : "danger",
			title : "Actions",
		}).find(".panel-body");
		htmlGen.createForm("#createRPForm",{
			button : {color : "success",text  : "Create"}
		});
	},
	
	startUp : function(){
		console.log(this.battleSystemSelecClass);
		this.basicFormHolder.empty();
		api.get({
			url : "system",
			callBack : (xhr,success)=>{
				if(!success){
					return;
				}
				this.systems = xhr.responseJSON && xhr.responseJSON.data;
				const options = [];
				this.systems.forEach(
					(value,key) => options.push({
						value : value.battleSystem.id,
						text  : value.battleSystem.name,
						data  : {name : "key",value : key},
						
					})
				);
				htmlGen.createForm(
					this.basicFormHolder,
					{
						inputs : [
							{
								label : "Roleplay name",
								input : {type : "text",name : "name"}
							},
							{
								label : "Maximum stats",
								input : {
									type : "number",
									name : "startingStatAmount"
								}
							},
							{
								label : "Maximum abilities",
								input : {
									type : "number",
									name : "startingAbilityAmount"
								}
							},
							{
								label : "Description",
								input : {type:"textarea",name:"description"}
							},
							{
								label : "Battle System",
								input : {
									type : "select",
									name : "battleSystem",
									options : options,
									cssClass : this.battleSystemSelecClass
								}
							}
						],
					}
				);
				this.bindEventsLate();
				this.renderDefaults(0);
			}
		})
		console.log(this.statsFormHolder);
	},
	
	renderDefaults : function(key){
		this.statsFormHolder.empty();
		this.actionsFormHolder.empty();
		this.renderActions(key);
		this.renderStats(key);
	},
	getTableData : function(data){
		const tableData =  {
			head : {
				row      : ["Name","description"],
				cssClass : "table table-striped"
			},
			rows : []
		}
		data.forEach(
			value=>tableData.rows.push([
				value.name,
				value.description
			])
		);
		return tableData
	},
	renderActions : function(key){
		const chosenActions = this.systems[key].actions || [];
		const tableData = this.getTableData(chosenActions);
		htmlGen.createTable(this.actionsFormHolder,tableData);
	},
	renderStats : function(key){
		const chosenStats = this.systems[key].stats || [];
		const tableData = this.getTableData(chosenStats);
		htmlGen.createTable(this.statsFormHolder,tableData);
	},
	bindEventsLate : function(){
		const that = this;
		$("."+this.battleSystemSelecClass).on("change",function(){
			const el = $(this);
			const selectedOption = $(this).find(':selected')
			const selectedKey = selectedOption.data('key')
			console.log(selectedKey);
			that.renderDefaults(selectedKey);
		});
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
