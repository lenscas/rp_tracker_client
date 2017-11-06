function BattleDisplay(data,callBack){
	this.container = data.container;
	this.getCharStats = data.getCharStats;
	this.enableSaveButton = data.enableSafeButton;
	this.rpCode = data.rpCode;
	this.systemName = data.system;
	const newCallBack = (battleSystem)=>{
		if(!battleSystem){
			console.error(this.battleSystemName + " is not found.");
		} else {
			this.system = battleSystem;
		}
		callBack(this);
	}
	codeHandler.loadDependencies(
		["battleSystemHelper"],
		()=>battleSystems.load(this.systemName,newCallBack)
	);
	
}
BattleDisplay.prototype.makeForm = function(data){
	console.log("in make form");
	data = data ||{}
	data.addEvents = (! ("addEvents" in data)) || data.addEvents;
	this.resultDisplay = $('<div></div>').addClass("col-md-8");
	this.rollDisplay   = $('<div></div>').addClass("col-md-4");
	this.actionSelect  = $('<select class="form-control"></select>');
	Object.keys(this.system.actions).forEach(value=>{
		this.actionSelect.append(
			$('<option></option>')
				.html(value)
				.val(value)
		)
	}

		
	);
	this.selectContainer = $('<div></div>')
		.addClass("col-md-7")
		.appendTo(this.rollDisplay);
	this.buttonContainer = $('<div></div>')
		.addClass("col-md-5")
		.appendTo(this.rollDisplay);
	this.rollButton = $('<button></button')
		.html("Roll")
		.addClass("btn btn-warning")
		.appendTo(this.buttonContainer);
	this.saveButton = $('<button></button>')
		.html("Save")
		.addClass("btn btn-success")
		.addClass("pull-right")
		.prop("disabled",true)
		.appendTo(this.buttonContainer);
	this.actionSelect.appendTo(this.selectContainer);
	this.resultDisplay.appendTo(this.container);
	this.rollDisplay.appendTo(this.container);
	if(data.addEvents){
		this.addEvents();
	}
}
BattleDisplay.prototype.simpleRoll = function(size,amount){
	let total=0;
	for (let i = 0; i<amount; i++) {
		total = total + Math.floor(Math.random() * size )+1;
	}
	return total;
}
BattleDisplay.prototype.addEvents =function(){
	const that = this;
	this.rollButton.on("click",function(event){
		event.preventDefault();
		const charStats = that.getCharStats();
		that.on    = charStats.on;
		const mode = that.actionSelect.val();
		const data = that.system.actions[mode](charStats.attacker,charStats.defender);
		console.log(data);
		let message = ""
		let damage = 0;
		data.forEach(value=>{
			if(value.attacker){
				message = message +value.attacker
			}
			if(value.defender){
				message = message + value.defender
			}
			if(value.outcome.str){
				message = message+value.outcome.str
			}
			if(value.outcome.damage){
				damage = damage+value.outcome.damage
			}
		});
		that.damage =damage;
		if(that.enableSaveButton){
			that.saveButton.prop("disabled",that.damage===0);
		}
		that.resultDisplay.empty().html(message);
	});
	this.saveButton.on("click",function(event){
		event.preventDefault();
		if(that.damage!=0){
			const stats = that.getCharStats().defender;
			const damageMod = that.system.calcRawDamageToMod(stats,-that.damage);
			api.post({
				url  : "rp/"+that.rpCode+"/characters/"+that.on+"/modifiers",
				data : damageMod,
				callBack : function(xhr,status){
					if(status!=="success"){
						return;
					}
					codeHandler.rerun();
				}
			});
		}
	});
}
