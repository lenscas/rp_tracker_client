function BattleDisplay(data,callBack){
	this.container        = data.container;
	this.getCharCodes     = data.getCharCodes;
	this.enableSaveButton = data.enableSafeButton;
	this.rpCode           = data.rpCode;
	this.battleId         = data.battleId
	callBack(this);
	/*
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
	*/
}
BattleDisplay.prototype.makeForm = function(data){
	data = data || {}
	data.addEvents = (! ("addEvents" in data)) || data.addEvents;
	this.resultDisplay = $('<div></div>').addClass("col-md-8");
	this.rollDisplay   = $('<div></div>').addClass("col-md-4");
	this.actionSelect  = $('<select class="form-control"></select>');
	api.get({
		url : "rp/"+this.rpCode + "/actions",
		callBack : (xhr,status)=>{
			if(status!=="success"){
				return
			}
			const xhrData = xhr.responseJSON;
			xhrData.data.forEach(
				value=>{
					this.actionSelect.append(
						$('<option></option>')
							.html(value.name)
							.val(value.id)
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
	});
	
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
		const charData = that.getCharCodes();
		const mode = that.actionSelect.val();
		api.post({
			url  : "rp/"+that.rpCode+"/battles/"+that.battleId + "/actions/"+mode+"/run",
			data : {
				user : charData.user.code,
				target : charData.target.code,
				userSelect : charData.user.selected,
				targetSelect : charData.target.selected,
				autoUpdate : false
			},
			callBack : (xhr,status)=>{
				if(status!=="success"){
					return;
				}
				const data = xhr.responseJSON;
				
				that.newDeltas = data.data.deltas;
				if(!data.success){
					message = "<pre>"+data.script+"</pre>";
					that.saveButton.prop("disabled",true);
					that.resultDisplay.empty()
					return
				}
				let message = ""
				data.data.deltas.forEach((value)=>{
					switch(value.what){
						case data.data.kinds.OUTPUT:
						case data.data.kinds.ERROR:
							message = message + value.message;
						break;
						case data.data.kinds.MODIFIER:
							switch(value.mode){
								case data.data.modes.INSERT:
									message += "New modifier named " + value.name +
										" with an amount of " + value.amount +
										" , a count down off " + value.countDown +
										" on stat "+ value.type;
								break;
								case data.data.modes.UPDATE:
									message += "Changed modifier "+value.name+"."
									if(value.amount!==undefined){
										message += " Set amount to "+value.amount;
									}
									if(value.countDown!==undefined){
										message += " Set count down to " + value.countDown;
									}
								break;
								case data.data.modes.DELETE:
									message +="Removed modifier " + value.name +"."
							}
						break;
					}
					message +="<br>";
				});
				if(that.enableSaveButton){
					that.saveButton.prop("disabled",false);
				}
				
				that.resultDisplay.empty().html(message);
				
			}
		});
	});
	this.saveButton.on("click",function(event){
		event.preventDefault();
		if(that.newDeltas){
			const data = JSON.stringify(that.newDeltas);
			console.log(data);
			api.put({
				url  : "rp/"+that.rpCode+"/battles/"+that.battleId+"/env",
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
