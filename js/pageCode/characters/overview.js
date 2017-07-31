pageHandler.registerPageCode({
	startUp : function(params){
		const rpCode   = params[0];
		const charCode = params[1];
		let that = this;
		api.get({
			url : "rp/"+rpCode+"/characters/"+charCode,
			callBack : function(xhr,status){
				if(status!=="success"){
					return;
				}
				//get the relevant data
				const data      = xhr.responseJSON;
				const character = data.character;
				const canEdit   = data.canEdit; //not used yet
				const abilities = data.abilities;
				//get the relevant html
				const idPrefix    = "#charOverView";
				const stats       = $(idPrefix+"Stats").empty();
				const apearance   = $(idPrefix+"Appearance").empty();
				const abilityCont = $(idPrefix+"Abilities").empty();
				const personality = $(idPrefix+"Personality").empty();
				const notes       = $(idPrefix+"Notes").empty();
				const backstory   = $(idPrefix+"Backstory").empty();
				//start by filling in the stats
				that.stats(stats,character.stats,character.age);
				that.appearance(
					apearance,
					character.appearanceDescription,
					character.appearancePicture,
					character.isLocalImage
				);
				that.backstory(backstory,character.backstory);
				that.abilities(abilityCont,abilities);
				that.personality(personality,character.personality);
				that.notes(notes,"some test notes");
				$(idPrefix+"Name").html(character.name);
				that.bindEventsAfterGet();
			}
		})
	},
	stats : function(container,stats,age){
		let table = {
			head : {
				row      : ["Name","Amount"],
				cssClass : "table table-striped"
			},
			rows : [
				["age",age]
			]
		};
		stats.forEach(value =>table.rows.push([value.name,value.value]))
		let tableEl = htmlGen.createTable(container,table);
	},
	appearance : function(container,text,image,imageIsLocal){
		if(image){
			if(imageIsLocal && imageIsLocal!="0"){
				image = conf.api_base +image
			}
			container.append(
				$('<img>')
					.attr("src",image)
					.addClass("img-responsive")
			);
		}
		if(text){
			container.append(text.replace("\n","<br>"));
		}
	},
	backstory : function(container,backstory){
		container.append(backstory.replace("\n","<br>"));
	},
	abilities : function(container,abilities){
		abilities.forEach(value=>{
			container.append(
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
	personality : function(container,personality){
		container.append(personality.replace("\n",'<br>'));
	},
	notes : function(container,notes){
		container.append(notes.replace("\n",'<br>'));
	},
	bindEventsAfterGet : function(){
		simpleEvents.togglePanelShow(".charOverClickHide","click");
		/*
		$(".charOverClickHide").on("click",function(event){
			if(event.isDefaultPrevented()){
				return;
			}
			event.preventDefault();
			$(this).children(".panel-body").toggle();
		})
		* */
	},
	unload : function(){
		$(".charOverClickHide").off("click");
	}
})

