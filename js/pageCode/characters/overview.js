codeHandler.registerPageCode({
	depsHTML : ["modal"],
	startUp  : function(params){
		this.rpCode   = params[0];
		this.charCode = params[1];
		api.get({
			url : "rp/"+this.rpCode+"/characters/"+this.charCode,
			callBack : (xhr,status)=>{
				if(status!=="success"){
					return;
				}
				//get the relevant data
				const data      = xhr.responseJSON.data;
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
				if(!canEdit || canEdit==="0"){
					$(".editChar").hide();
				} else {
					$(".editChar").show();
				}
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
	createEdit : function(){
		this.edit = {
			name : {
				inputs : [
					{
						input : {
							name  : "name",
							value : this.character.name
						},
						label : "Name"
					}
				]
			},
			backstory : {
				inputs : [
					{
						input : {
							name  : "backstory",
							type  : "textarea",
							value : this.character.backstory
							
						},
						label : "Backstory"
					}
				],
			},
			personality : {
				inputs : [
					{
						input : {
							name  : "personality",
							type  : "textarea",
							value : this.character.personality
							
						},
						label : "Personality"
					}
				],
			},
			notes : {
				inputs : [
					{
						input : {
							name  : "notes",
							type  : "textarea",
							value : this.character.notes
							
						},
						label : "Notes"
					}
				],
			},
			appearance : {
				inputs : [
					{
						input : {
							name : "appearanceDescription",
							type : "textarea",
							value:this.character.appearanceDescription
						},
						label : "Description"
					}
				]
			},
			stat : {
				title : "Edit base stats",
				inputs : [
					{
						input : {
							name : "age",
							type : "number",
							value : this.character.age
						},
						label : "Age"
					}
				]
			},
			ability : {
				title : "Edit abilities",
				custom : function(form,character,abilities){
					const createInputs = (ability =>{
						return [
							{
								input : {
									name  : "abilities["+ability.id+"][name]",
									value : ability.name,
								},
								label : "Name"
							},
							{
								input : {
									name  : "abilities["+ability.id+"][cooldown]",
									value : ability.cooldown,
									type  : "number"
								},
								label : "Cooldown"
							},
							{
								input : {
									name  : "abilities["+ability.id+"][description]",
									value : ability.description,
									type  : "textarea"
								},
								label : "Description"
							}
						]
					})
					abilities.forEach(value=>{
						const panel = htmlGen.createPanel(
							form,
							{
								title : value.name,
								color : "default"
							}
						);
						htmlGen.createForm(
							panel.find(".panel-body"),
							{
								inputs : createInputs(value)
							}
						);
					});
					htmlGen.createForm(
						form,
						{
							button : {
								color : "success",
								text  : "Edit"
							}
						}
					);
				}
			}
		}
		this.character.stats.forEach(
			value=>{
				this.edit.stat.inputs.push({
					input : {
						name  : "stats["+value.id+"]",
						value : value.value,
						type  : "number"
					},
					label : value.name
				});
			}
		);
		
	},
	bindEventsAfterGet : function(){
		this.createEdit();
		const that = this;
		simpleEvents.togglePanelShow(".charOverClickHide","click");
		$(".editChar").on("click",function(event){
			event.preventDefault();
			const el    = $(this);
			const what  = el.data("kind");
			const modal = $("#modal");
			if(that.edit[what]){
				const chosen = that.edit[what]
				title = chosen.title || "Edit "+what
				modal.find("#modalTitle").html(title);
				const body = modal.find("#modalBody").empty();
				const form = $('<form></form>').appendTo(body);
				if(!chosen.custom){
					htmlGen.createForm(
						form,
						{
							inputs : chosen.inputs,
							button : {
								color : "success",
								text  : "Edit"
							}
						}
					);
				} else {
					chosen.custom(form,that.character,that.abilities);
				}
				
				form.on("submit",function(event){
					event.preventDefault();
					api.patch({
						url  : "rp/"+that.rpCode+"/characters/"+that.charCode,
						data : $(this).serialize(),
						callBack : (xhr,status) =>{
							if(status!=="success"){
								console.log("something went wrong");
								return;
							}
							modal.modal("hide");
							codeHandler.rerun();
							
						}
					});
				});
				modal.modal("show");
			} else {
				console.log(what+ " Does not exist");
			}
			
		});
	},
	unload : function(){
		$(".charOverClickHide").off("click");
		$(".editChar").off("click");
	}
})

