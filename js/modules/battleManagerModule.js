function BattleManagerHelper(data){
	
	this.characterContainer = data.characterContainer;
	this.resultContainer    = data.resultContainer;
	this.config             = data.config;
	this.rpCode             = data.rpCode;
	this.characters         = data.characters;
	this.modifiers          = data.modifiers;
	this.actions            = data.actions;
	this.attackerPanel      = this.createSmallPanel("Attacker","danger");
	this.defenderPanel      = this.createSmallPanel("Defender","success");
	this.battleId           = data.battleId;
	
	codeHandler.loadDependencies(
		["battleDisplay","battleSystemHelper"],
		()=>{
			battleSystems.load(this.config.intName,(system)=>{
				this.system = system;
				this.fillResults();
				this.fillCharacters();
			});
			
		}
	);
}
BattleManagerHelper.prototype.remove = function(){
	this.characterContainer.empty();
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
	console.log(this.config.isGM);
	new BattleDisplay(
		{
			container    : this.resultContainer,
			getCharCodes : ()=>this.getCharCodes(),
			rpCode       : this.rpCode,
			battleId     : this.battleId,
			enableSafeButton : this.config.isGM
			
		},
		(battleDisplay)=>{
			this.battleDisplay = battleDisplay;
			this.battleDisplay.makeForm();
		}
	);
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
			.val(value.internalName)
			.html(value.name)
			.data("role",value.role)
	));
	$('<input>').appendTo(selector)
		.addClass("showCurrentAmount form-control");
}
BattleManagerHelper.prototype.getCharCodes = function(){
	const user = this.attackerPanel.find(".selectChar").val();
	const target = this.defenderPanel.find(".selectChar").val();
	const getStats = (charCode,role) =>{
		return {
			selected : {
				stat  : this[role+"Panel"].find(".selectStat").val(),
				value : Number(
					this[role+"Panel"].find(".showCurrentAmount").val()
				)
			},
			code : charCode
		}
	}
	let returnData = {
		user : getStats(user,"attacker"),
		target : getStats(target,"defender")
		
	};
	return returnData;
}
BattleManagerHelper.prototype.updateInputs =function(cont){
	const charCode = cont.find(".selectChar").val();
	const statId   = cont.find(".selectStat").val();
	codeHandler.loadDependencies(["basicFunctions"],()=>{
		const mods = funcs.findMods(this.modifiers,charCode);
		const total = this.system.calcStats(mods);
		cont.find(".showCurrentAmount").val(total[statId]);
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
