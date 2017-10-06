function BattleManagerHelper(data){
	this.characterContainer = data.characterContainer;
	this.resultContainer    = data.resultContainer;
	this.config             = data.config;
	this.rpCode             = data.rpCode;
	this.characters         = data.characters;
	this.modifiers          = data.modifiers;
	this.attackerPanel      = this.createSmallPanel("Attacker","danger");
	this.defenderPanel      = this.createSmallPanel("Defender","success");
	this.fillCharacters();
	//*
	codeHandler.loadDependencies(
		["battleDisplay"],
		()=>{
			this.fillResults()
		}
	);
}
BattleManagerHelper.prototype.createSmallPanel = function(name,color){
	const container = $('<div class="col-md-6"></div>')
		.appendTo(this.characterContainer);
	return htmlGen.createPanel(
		container,
		{ title : name,color : color,}
	);
}
BattleManagerHelper.prototype.fillCharacters = function(){
	this.makeInputs(this.attackerPanel.find(".panel-body"),"Attacker");
	this.makeInputs(this.defenderPanel.find(".panel-body"),"Defender");
	this.updateInputs(this.attackerPanel);
	this.updateInputs(this.defenderPanel);
	this.bindEventsLate();
}
BattleManagerHelper.prototype.fillResults =function(){
	if(!this.resultContainer){
		this.makeResultsContainer();
	}
	this.battleDisplay = new BattleDisplay({
		container    : this.resultContainer,
		getCharStats : ()=>this.getChosenStats(),
		healthStatId : this.findHealthStatId(),
		rpCode       : this.rpCode,
		enableSafeButton : this.config.isGM
	});
	this.battleDisplay.makeForm();
}
BattleManagerHelper.prototype.makeInputs = function(selector,name){
	const selectChar = $('<select></select>')
		.addClass("selectChar updateStat form-control")
		.appendTo(selector);
	this.characters.forEach(value=>selectChar.append($('<option></option>')
			.val(value.code)
			.html(value.name)
		)
	);
	const selectStat = $('<select></select>')
		.addClass("selectStat updateStat form-control")
		.appendTo(selector);
	this.config.statSheet.forEach(value=>selectStat.append(
		$('<option></option>')
			.val(value.id)
			.html(value.name)
			.data("role",value.role)
	));
	$('<input>').appendTo(selector)
		.addClass("showCurrentAmount form-control");
}
BattleManagerHelper.prototype.getCharStats = function(charCode){
		let returnData = {};
		const findStatRole = statId => {
			let role;
			this.config.statSheet.some(stat =>{
				if(stat.id===statId){
					role= stat.role;
					return true;
				}
			});
			return role;
		}
		this.modifiers.forEach(value=>{
			if(value.code===charCode){
				const statRole = findStatRole(value.statId);
				returnData[statRole] = returnData[statRole] || 0;
				returnData[statRole] = returnData[statRole]+Number(value.value)
			}
		});
		return returnData;
	},
BattleManagerHelper.prototype.getChosenStats = function(){
	const attacker = this.attackerPanel.find(".selectChar").val();
	const defender = this.defenderPanel.find(".selectChar").val();
	const getStats = (char,role) =>{
		let charData = this.getCharStats(char);
		charData.selected =  Number(
			this[role+"Panel"].find(".showCurrentAmount").val()
		)
		return charData;
	}
	let returnData = {};
	returnData.attacker = getStats(attacker,"attacker");
	returnData.defender = getStats(defender,"defender");
	returnData.on       = defender;
	return returnData;
}
BattleManagerHelper.prototype.findHealthStatId =function(){
	this.config.statSheet.some(
		value=>{
			if(value.role==="health"){
				this.healthStatId=value.id;
				return true;
			}
		}
	)
	return this.healthStatId;
}
BattleManagerHelper.prototype.updateInputs =function(cont){
	const charCode = cont.find(".selectChar").val();
	const statId   = cont.find(".selectStat").val();
	codeHandler.loadDependencies(["basicFunctions"],()=>{
		const total = funcs.findCorrectMods(this.modifiers,charCode,statId);
		cont.find(".showCurrentAmount").val(total);
	});
	
	
},
BattleManagerHelper.prototype.bindEventsLate = function(){
	const that = this;
	$(".updateStat").on("change",function(){
		const el   = $(this);
		const cont = el.closest(".panel-body");
		that.updateInputs(cont);
	});
}
BattleManagerHelper.prototype.makeResultsContainer = function(){
	const container = $('<div class="col-md-12"></div>').appendTo(
		$('<div class="row"></div>')
			.appendTo(this.characterContainer)
	);
		
	
	this.resultPanel = htmlGen.createPanel(
		container,
		{
			title : "Roll",
			color : "info"
		}
	);
	this.resultContainer = this.resultPanel.find(".panel-body");
}
