codeHandler.registerPageCode({
	idPrefix : "#createCharacter",
	config   : {},
	once     : function(){
		htmlGen.createForm(this.idPrefix+"Basic",{
			idPrefix : "createCharacter",
			inputs : [
				{
					input : {name  : "name"},
					label : "Name",
				},
				{
					input : {name  : "age",type:"number"},
					label : "Age",
				},
				{
					input : {name  : "backstory",type  : "textarea"},
					label : "Backstory",
					
				},
				{
					input : {name : "appearanceDescription",type  : "textarea"},
					label : "Appearance",
				},
				{
					input : {name : "personality",type  : "textarea"},
					label : "Personality",
				}
			]
		});
		htmlGen.createForm(this.idPrefix+"Form",{
			button : {
				color : "success",
			}
		});

	},
	startUp : function(params){
		this.code = params[0];
		api.get({
			url : "rp/"+this.code+"/config",
			callBack :(xhr,status)=>{
				console.log(this);
				console.log(xhr);
				if(status!=="success"){
					return;
				}
				
				const data     = xhr.responseJSON.data || xhr.responseJSON;
				this.config    = data;
				const statCon  = $(this.idPrefix+"Stats").empty();
				let   statForm = { 
					idPrefix : "createCharacter",
					inputs : [] 
				}
				data.statSheet.forEach(
					value=>statForm.inputs.push({
						label : value.name,
						input : {
							name  : "stats["+value.id+"]",
							type  : "number",
							required : false,
							cssClass : "createCharacterStatInput",
							value : 0,
						}
					})
					
				);
				htmlGen.createForm(statCon,statForm);
				$(this.idPrefix+"StatTotal").html("0 / "+data.max.startingStatAmount);
				this.createAbilities(data.max.startingAbilityAmount);
				simpleEvents.togglePanelShow(".createCharacterPanels");
				this.bindEventsLate();
			}
		})
	},
	createAbilities :function(abilityAmount){
		const abilityCon = $(this.idPrefix+"Abilities").empty();
		for(i=1;i<=abilityAmount;i++){
			const panel = htmlGen.createPanel(
				abilityCon,
				{
					color : "default createCharacterPanels",
					title : "Ability-"+i,
				}
			)
			htmlGen.createForm(
				panel.find(".panel-body"),
				{
					idPrefix : "createCharacter",
					inputs : [
						{
							input : {
								name  : "abilities[ability"+i+"][name]",
								required : false
							},
							label : "Ability name",
							
						},
						{
							input : {
								name  : "abilities[ability"+i+"][cooldown]",
								type  : "number",
								required : false
							},
							label : "Cooldown"
						},
						{
							input : {
								name  : "abilities[ability"+i+"][description]",
								type  : "textarea",
								required : false
							},
							label : "Ability description"
						},
					]
			});
		}
	},
	bindEvents :function(){
		let that =this;
		$(this.idPrefix+"Form").on("submit",function(event){
			event.preventDefault();
			api.post({
				url : "rp/"+that.code+"/characters",
				data : $(this).serialize(),
				callBack :function(xhr,status){
					let json = xhr.responseJSON;
					if(status=="success" && !json.error){
						console.log("test?");
						let location =xhr.getResponseHeader("location")
						location = location.replace(conf.api,"");
						
						pageHandler.goTo(conf.base_url+location);
					}
				}
			});
		});
		
	},
	bindEventsLate : function(){
		let that = this;
		$(".createCharacterStatInput").on("click",function(event){
			console.log("wtf?");
			event.preventDefault();
		})
		$(".createCharacterStatInput").on("change",function(event){
			let total = 0;
			$(".createCharacterStatInput").each(function(){
				console.log(this.value);
				total = total + Number(this.value)
			});
			$(that.idPrefix+"StatTotal")
				.html(total+"/"+that.config.max.startingStatAmount);
		});
	},
	unload : function(){
		$(".createCharacterPanels").off("click");
		$(this.idPrefix+"Form").off("submit");
		$(".createCharacterStatInput").off("click");
		$(".createCharacterStatInput").off("change");
	}
})
