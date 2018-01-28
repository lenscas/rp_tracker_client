codeHandler.loadDependencies(["modifierFormHelper"],()=>{});
function CharacterFormHelper(data){
	this.characters = data.characters;
	this.config     = data.config;
	this.container  = data.container;
	this.modifiers  = data.modifiers;
	this.cellClass  = data.cellClass || "characterStatCell";
	this.modal      = data.modal;
	this.rpCode     = data.rpCode;
	this.partUrl    = "rp/"+this.rpCode+"/characters/";
	this.baseUrl    = conf.base_url+this.baseUrl;
}
CharacterFormHelper.prototype.createTableData =function(callBack){
	codeHandler.loadDependencies(
		["basicFunctions","battleSystemHelper"],
		()=>{
			battleSystems.load(this.config.intName,(battleSystem)=>{
				this.system = battleSystem;
				this._createTableData(callBack);
			});
			
		}
	);
}
CharacterFormHelper.prototype._createTableData = function(callBack){
	let tableData = {
	head : {
		row      : ["Name"],
		cssClass : "table table-striped"
	},
	rows : []
	}
	this.config.statSheet.forEach(
		value=>tableData.head.row.push(
			{
				text : value.name,
				data : {name:"mod-type-name",value:value.internalName},
			}
		)
	);
	console.log(this.characters);
	this.characters.forEach(value=>{
		let row = [];
		tableData.head.row.forEach(headData =>{
			const mods = funcs.findMods(
				this.modifiers,
				value.code,
				headData.value,
			);
			const calculated = this.system.calcStats(mods);
			if(typeof(headData)==="string"){
				row.push(
					htmlGen.createLink(
						false,
						{
							href : this.partUrl+value.code,
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
						content   : String(calculated[headData.data.value])
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
	callBack(tableData);
}
CharacterFormHelper.prototype.createTable = function(bindEvents=true){
	tableData = this.createTableData(tableData=>{
		const table = htmlGen.createTable(
			this.container, 
			tableData
		);
		table.dataTable();
		bindEvents && this.bindCharacterEvents();
		return table;
	});
	
}

CharacterFormHelper.prototype.bindCharacterEvents = function(){
	if(!this.config.isGM){
		console.log("not a gm");
		return;
	}
	let that = this;
	$(".characterListModifierCell").on("click",function(event){
		codeHandler.loadDependencies(["basicFunctions"],()=>{
			const el = $(this);
			const modId    = el.data("mod-type-id");
			const charCode = el.closest("tr").data("character-code");
			const modList  = funcs.findMods(
				that.modifiers,
				charCode,
				modId
			).list;
			const modal    = that.modal
			if(!modFormHelper){
				alertManager.show("The page is not fully done loading.");
				return;
			}
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
				container : $(modal).find(".modal-body"),
				modal     : modal,
				
			});
		});
		
	});
}
