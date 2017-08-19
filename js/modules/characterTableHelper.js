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
CharacterFormHelper.prototype.createTableData = function(){
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
				data : {name:"mod-type-id",value:value.id},
			}
		)
	);
	this.characters.forEach(value=>{
		let row = [];
		tableData.head.row.forEach(headData =>{
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
						content   : this.findCorrectMods(
							value.code,
							headData.data.value,
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
	return tableData;
}
CharacterFormHelper.prototype.createTable = function(bindEvents=true){
	tableData = this.createTableData();
	const table = htmlGen.createTable(
		this.container, 
		tableData
	);
	table.dataTable();
	bindEvents && this.bindCharacterEvents();
	return table;
}
CharacterFormHelper.prototype.findCorrectMods = function(charCode,modTypeId,asArray=false){
	let total=0;
	if(asArray){
		total = [];
	}
	this.modifiers.forEach(mod=>{
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
}
CharacterFormHelper.prototype.bindCharacterEvents = function(){
	if(!this.config.isGM){
		console.log("not a gm");
		return;
	}
	let that = this;
	$(".characterListModifierCell").on("click",function(event){
		const el = $(this);
		const modId    = el.data("mod-type-id");
		const charCode = el.closest("tr").data("character-code");
		const modList  = that.findCorrectMods(charCode,modId,true);
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
}
