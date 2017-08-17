codeHandler.registerPageCode({
	depsHTML : ["modal"],
	startUp  : function(params){
		const rpCode   = params[0];
		const charCode = params[1];
		api.get({
			url : "rp/"+rpCode+"/characters/"+charCode,
			callBack : (xhr,status)=>{
				if(status!=="success"){
					return;
				}
				//get the relevant data
				const data      = xhr.responseJSON;
				const character = data.character;
				const canEdit   = data.canEdit; //not used yet
				this.abilities  = data.abilities;
				//get the relevant html
				this.idPrefix        = "#charOverView";
				this.statsCont       = $(this.idPrefix+"Stats").empty();
				this.apearanceCont   = $(this.idPrefix+"Appearance").empty();
				this.abilityCont     = $(this.idPrefix+"Abilities").empty();
				this.personalityCont = $(this.idPrefix+"Personality").empty();
				this.notesCont       = $(this.idPrefix+"Notes").empty();
				this.backstoryCont   = $(this.idPrefix+"Backstory").empty();
				this.character       = character;
				//start by filling in the stats stats,character.stats,character.age
				this.fillStats();
				this.fillAppearance();
				this.fillBackstory();
				this.fillAbilities();
				this.fillPersonality();
				this.fillNotes();
				$(this.idPrefix+"Name").html(character.name);
				this.bindEventsAfterGet();
				
			}
		})
	},
	fillStats : function(){
		let table = {
			head : {
				row      : ["Name","Amount"],
				cssClass : "table table-striped"
			},
			rows : [
				["age",this.character.age]
			]
		};
		this.character.stats.forEach(
			value =>table.rows.push(
				[value.name,value.value]
			)
		)
		htmlGen.createTable(this.statsCont,table);
	},
	fillAppearance : function(){
		if(this.character.appearancePicture){
			if(this.character.isLocalImage && this.character.isLocalImage!="0"){
				image = conf.api_base +image
			} else {
				image = this.character.appearancePicture
			}
			this.apearanceCont.append(
				$('<img>')
					.attr("src",image)
					.addClass("img-responsive")
			);
		}
		if(this.character.appearanceDescription){
			this.apearanceCont.append(
				this.character.appearanceDescription.replace("\n","<br>")
			);
		}
	},
	fillBackstory : function(){
		this.backstoryCont.append(this.character.backstory.replace("\n","<br>"));
	},
	fillAbilities : function(container,abilities){
		this.abilities.forEach(value=>{
			this.abilityCont.append(
				$('<div class="panel charOverClickHide panel-warning"></div>')
					.append(
						$('<div class="panel-heading"></div>')
							.append(value.name)
							.append(
								$('<span class="pull-right"></span')
									.append(value.cooldown)
							)
					)
					.append(
						$('<div class="panel-body"></div>')
							.append(value.description.replace("\n",'<br>'))
					)
			)
		});
	},
	fillPersonality : function(container,personality){
		this.personalityCont.append(
			this.character.personality.replace("\n",'<br>')
		);
	},
	fillNotes : function(container,notes){
		this.notesCont.append(this.character.notes.replace("\n",'<br>'));
	},
	bindEventsAfterGet : function(){
		simpleEvents.togglePanelShow(".charOverClickHide","click");
	},
	unload : function(){
		$(".charOverClickHide").off("click");
	}
})

