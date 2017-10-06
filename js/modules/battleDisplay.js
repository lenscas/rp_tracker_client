function BattleDisplay(data){
	this.container = data.container;
	this.getCharStats = data.getCharStats;
	this.healthStatId = data.healthStatId;
	this.enableSaveButton = data.enableSafeButton;
	this.rpCode = data.rpCode;
	this.options = data.options || [
		{
			text : "Basic attack",
			roll : (atk,def)=>{
				const data = {atk:{},def:{}};
				data.atk.accuracy = this.simpleRoll(atk.evade_attack,10);
				data.def.agility  = this.simpleRoll(def.evade_defense,10);
				if(data.atk.accuracy<=data.def.agility){
					data.hit = false;
					return data;
				} else {
					data.hit=true;
				}
				data.atk.atk = this.simpleRoll(10,atk.physical_attack);
				data.def.def = this.simpleRoll(10,def.physical_defense);
				dif=data.atk.atk-data.def.def;
				data.damage = Math.floor(dif/10);
				data.damage = (data.damage>3 ? 3 : data.damage);
				data.damage = (data.damage<0 ? 0 : data.damage);
				return data;
			},
			display : data =>{
				let returnSTR = "The attacker rolled "+data.atk.accuracy;
				returnSTR += ".<br>The defender rolled "+data.def.agility;
				if(!data.hit){
					return returnSTR +=".<br>The attack missed.";
				}
				returnSTR +=".<br>The attack landed.<br>";
				returnSTR +="The attacker rolled "+data.atk.atk;
				returnSTR +=".<br>The defender rolled "+data.def.def;
				return returnSTR += ".<br>The attacker did "+data.damage+" damage";
			}
		},
		{
			text : "Custom roll",
			roll : (atk,def)=>{
				return {
					def : this.simpleRoll(10,def.selected),
					atk : this.simpleRoll(10,atk.selected)
				}
			},
			display : data => {
				let returnSTR = "The attacker rolled "+data.atk
				return returnSTR +=".<br> The defender rolled "+data.def+" ."
			}
		}
	]
}
BattleDisplay.prototype.makeForm = function(data){
	data = data ||{}
	data.addEvents = (! ("addEvents" in data)) || data.addEvents;
	this.resultDisplay = $('<div></div>').addClass("col-md-8");
	this.rollDisplay   = $('<div></div>').addClass("col-md-4");
	this.actionSelect  = $('<select class="form-control"></select>');
	this.options.forEach((value,key)=>
		this.actionSelect.append(
			$('<option></option>')
				.html(value.text)
				.val(key)
		)
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
		console.log(charStats);
		that.on    = charStats.on;
		const mode = that.actionSelect.val();
		const data = that.options[mode].roll(charStats.attacker,charStats.defender);
		const message = that.options[mode].display(data);
		that.damage = data.damage || 0;
		if(that.enableSaveButton){
			that.saveButton.prop("disabled",that.damage===0);
		}
		that.resultDisplay.empty().html(message);
	});
	this.saveButton.on("click",function(event){
		event.preventDefault();
		if(that.damage!=0){
			const data = {
				name      : that.damage>0 ? "Damage" : "Healing",
				value     : -that.damage,
				statId    : that.healthStatId,
				countDown : -1
			};
			api.post({
				url  : "rp/"+that.rpCode+"/characters/"+that.on+"/modifiers",
				data : data,
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
