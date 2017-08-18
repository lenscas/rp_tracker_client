codeHandler.registerPageCode({
	idPrefix     : "#battleManage",
	dependencies : ["characterTableHelper","abilityTableHelper","battleDisplay"],
	depsHTML     : ["modal"],
	once :function(){
		const addPanelsTo = this.idPrefix + "Body";
		this.selectPanel = htmlGen.createPanel(
			addPanelsTo,
			{
				title : $('<div></div>')
					.append("Select")
					.append(
						$('<span></span>')
							.addClass("pull-right")
							.append(
								$('<p>Next turn</p>')
									.addClass("btn btn-success ")
									.addClass("battleManageNextTurn btnFixPullRight")
							)
					),
				color : "primary",
				text  : $('<div></div>')
					.append(
						$('<div></div>')
							.addClass("row")
							.append(
								$('<div></div>')
									.addClass("col-md-6 attackerContainer")
							)
							.append(
								$('<div></div>')
									.addClass("col-md-6 defenderContainer")
							)
					)
					.append(
						$('<div class="row"></div>')
							.append(
								$('<div></div>')
									.addClass("col-md-12 resultContainer")
							)
					)
			}
		);
		this.selectPanelBody = this.selectPanel.find(".panel-body");
		this.attackerPanel = htmlGen.createPanel(
			this.selectPanelBody.find(".attackerContainer"),
			{title : "attacker",color : "danger"}
		);
		this.defenderPanel = htmlGen.createPanel(
			this.selectPanelBody.find(".defenderContainer"),
			{title : "defender",color : "success"}
		);
		this.charactersPanel = htmlGen.createPanel(
			addPanelsTo,
			{title : "Characters",color : "success"}
		);
		this.abilitiesPanel = htmlGen.createPanel(
			addPanelsTo,
			{title : "Abilities",color : "warning"}
		);
		this.resultPanel = htmlGen.createPanel(
			this.selectPanelBody.find(".resultContainer"),
			{
				title : "Roll",
				color : "info",
				text  : $('<div></div>')
					.append(
						$('<div></div>')
							.addClass("col-md-8 diceResultContainer")
					)
					.append(
						$('<div></div>')
							.addClass("col-md-4 selectKindDice")
					)
			}
		);
	},
	startUp : function(params){
		this.rpCode   = params[0]
		this.battleId = params[1]
		this.baseUrl  = "rp/"+this.rpCode+"/"
		let counter   = 0;
		const canGoFurther = ()=>{
			counter++;
			if(counter>=2){
				this.fillCharacterTable();
				this.fillAbilitiesTable();
				this.fillManageer();
			}
		}
		api.get({
			url : "rp/"+this.rpCode+"/battles/"+this.battleId,
			callBack : (xhr,status)=>{
				if(status!=="success"){
					return;
				}
				const data = xhr.responseJSON.data;
				this.characters = data.characters;
				this.modifiers  = data.modifiers;
				canGoFurther();
			}
		})
		api.get({
			url : "rp/"+this.rpCode+"/config",
			callBack : (xhr,status)=>{
				if(status!=="success"){
					return;
				}
				this.config = xhr.responseJSON.data;
				canGoFurther();
			}
		})
	},
	fillCharacterTable : function(){
		this.characterTableMan = new CharacterFormHelper({
			characters : this.characters,
			modifiers  : this.modifiers,
			container  : this.charactersPanel.find(".panel-body").empty(),
			config     : this.config,
			modal      : "#modal",
			rpCode     : this.rpCode,
		});
		this.characterTableMan.createTable();
	},
	fillAbilitiesTable : function(){
		const that = this;
		api.get({
			url : this.baseUrl+"abilities",
			callBack : (xhr,status)=>{
				if(status!=="success"){
					return;
				}
				const data = xhr.responseJSON.data;
				abilityTable = new AbilityTableHelper({
					abilities : data,
					container : this.abilitiesPanel.find(".panel-body").empty()
				});
				abilityTable.createTable();
			}
		})
	},
	getCharStats : function(charCode){
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
	fillManageer : function(){
		const makeInputs = (selector,name)=>{
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
		makeInputs(this.attackerPanel.find(".panel-body").empty());
		makeInputs(this.defenderPanel.find(".panel-body").empty());
		
		let getCharStats = ()=>{
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
		let healthStatId;
		this.config.statSheet.some(
			value=>{
				if(value.role==="health"){
					healthStatId=value.id;
					return true;
				}
			}
		)
		this.battleDisplay = new BattleDisplay({
			container : this.resultPanel.find(".panel-body").empty(),
			getCharStats : getCharStats,
			healthStatId  : healthStatId,
			rpCode       : this.rpCode,
			enableSafeButton : this.config.isGM
		});
		this.battleDisplay.makeForm();
		this.updateInputs(this.attackerPanel);
		this.updateInputs(this.defenderPanel);
		this.bindEventsLate();
	},
	updateInputs : function(cont){
		const charCode = cont.find(".selectChar").val();
		const statId   = cont.find(".selectStat").val();
		const total    = this.characterTableMan.findCorrectMods(charCode,statId);
		cont.find(".showCurrentAmount").val(total);
	},
	bindEventsLate : function(){
		const that = this;
		$(".updateStat").on("change",function(){
			const el   = $(this);
			const cont = el.closest(".panel-body");
			that.updateInputs(cont);
		});
	}
})
