pageHandler.registerPageCode({
	idPrefix : "#createBattle",
	charList : [],
	once     : function(){
		const basicPanel = htmlGen.createPanel(this.idPrefix+"Form",{
			title : "Basic",
			color : "primary"
		});
		htmlGen.createForm(basicPanel.find(".panel-body"),{
			inputs : [
				{
					input : {name : "name"},
					label : "Battle name",
				},
				{
					input : {name : "link",required : false},
					label : "External Link",
				},
			]
		});
		this.characterPanel = htmlGen.createPanel(this.idPrefix+"Form",{
			title : "Characters",
			color : "success"
		});
		htmlGen.createForm(this.idPrefix+"Form",{
			button : {
				color : "success"
			}
		});
	},
	startUp : function(params){
		this.code = params[0];
		api.get({
			url : "rp/"+this.code+"/characters",
			callBack : (xhr,status)=>{
				if(status!=="success"){
					return;
				}
				this.characterPanel.find(".panel-body").empty();
				const characters = xhr.responseJSON.characters;
				characters.forEach(value =>
					this.charList.push({
						text  : value.name,
						value : value.code
					})
				);
				this.addCharacterInput();
			}
		})
	},
	addCharacterInput : function(){
		const options = [{text:"none",value:""}].concat(this.charList);
		htmlGen.createForm(
			this.characterPanel.find(".panel-body"),
			{
				inputs : [
					{
						row : {
							cssClass : "createBattleCharSelectContainer"
						},
						input : {
							type : "select",
							options : options,
							name : "characters[]",
							cssClass : "createBattleSelectCharacters",
							required : false
						},
						label : "Character"
					}
				]
			}
		);
	},
	bindEvents : function(){
		const that = this;
		
		$(this.idPrefix+"Form").on("submit",function(event){
			
			event.preventDefault();
			let data =[] 
			console.log(data);
			$(this).serializeArray().forEach(
				value=> value.value!=="" && data.push(value)
			);
			api.post({
				url : "rp/"+that.code+"/battles",
				data : data,
				callBack :function(xhr,status){
					let json = xhr.responseJSON;
					if(status=="success" && !json.error){
						let location =xhr.getResponseHeader("location")
						location = location.replace(conf.api,"");
						pageHandler.goTo(conf.base_url+location);
					}
				}
			});
		});
		$("body").on("change",".createBattleSelectCharacters",function(){
			$(".createBattleSelectCharacters").each(function(){
				const el  = $(this);
				const val = el.val();
				if(el.val()===""){
					el.closest(".createBattleCharSelectContainer").remove();
				}
			})
			that.addCharacterInput();
		});
	}
})
