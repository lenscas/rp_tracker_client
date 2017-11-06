codeHandler.registerPageCode({
	idPrefix     : "#battleManage",
	dependencies : ["characterTableHelper","battleManagerModule","abilityTableHelper","battleDisplay","basicFunctions"],
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
			}
		);
		this.selectPanelBody = this.selectPanel.find(".panel-body");
		this.charactersPanel = htmlGen.createPanel(
			addPanelsTo,
			{title : "Characters",color : "success"}
		);
		this.abilitiesPanel = htmlGen.createPanel(
			addPanelsTo,
			{title : "Abilities",color : "warning"}
		);
	},
	startUp : function(params){
		this.rpCode   = params[0]
		this.battleId = params[1]
		this.baseUrl  = "rp/"+this.rpCode+"/"
		let counter   = 0;
		const canGoFurther = ()=>{
			counter++;
			if(counter>=3){
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
		api.get({
			url : "rp/"+this.rpCode+"/actions",
			callBack : (xhr,status)=>{
				if(status!=="success"){
					return;
				}
				this.actions = xhr.responseJSON.data;
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
	fillManageer : function(){
		console.log("does this get executed too many times?");
		this.battleManager = new BattleManagerHelper({
			characterContainer : this.selectPanelBody.empty(),
			config             : this.config,
			rpCode             : this.rpCode,
			characters         : this.characters,
			modifiers          : this.modifiers,
			actions            : this.actions
		});
	}
})
