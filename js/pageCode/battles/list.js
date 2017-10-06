codeHandler.registerPageCode({
	rpCode : "",
	getBaseUrl : function(){
		return "rp/"+this.rpCode+"/";
	},
	colorClassList : [
		"info",
		"danger",
		"warning",
		"success",
		"default"
	],
	idPrefix : "#battleList",
	getRandomColor :function(){
		const rIndex = Math.floor(Math.random() * this.colorClassList.length);
		return this.colorClassList[rIndex];
	},
	startUp : function(params){
		this.rpCode = params[0];
		let that = this;
		$(this.idPrefix+"Battles").empty();
		api.get({
			url : "rp/"+this.rpCode+"/battles",
			callBack : (xhr,status)=>{
				if(status!=="success"){
					return;
				}
				const data = xhr.responseJSON.data;
				data.battles.forEach(
					value=>{
						const panel = that.getPanel(value)
						let tableData = {
							head : {
								cssClass : "table table-striped",
								row : ["name","turn","order"]
							},
							rows : []
						}
						value.characters.forEach(
							char=>tableData.rows.push(that.getCharRow(char))
						);
						htmlGen.createTable(
							panel.find(".panel-body"),
							tableData
						).dataTable({
							"order": [[ 2, "asc" ]]
						});
					}
				);
				simpleEvents.togglePanelShow(".battleListHide","click");
			}
		})
	},
	getPanel : function(battle){
		return htmlGen.createPanel(
			this.idPrefix+"Battles",
			{
				title : this.getPanelHeading(battle),
				color : this.getRandomColor() + " battleListHide"
				
			}
		);
	},
	getPanelHeading : function(battle){
		let extraClass="";
		if(!battle.link){
			extraClass = "newPage";
			battle.link = conf.base_url +this.getBaseUrl() + "battles/"+battle.id+"/pad";
		}
		return $('<div></div>')
			.append(
				htmlGen.createLink(
					false,
					{
						href : this.getBaseUrl() +"battles/"+battle.id,
						text : battle.name,
					}
				)
			)
			.append(
				$('<span></span>')
					.addClass("pull-right")
					.append(
						$('<a></a>')
							.addClass("btn btn-primary btnFixPullRight "+extraClass)
							.append("Pad")
							.attr("href",battle.link)
					)
			).html();
	},
	getCharRow : function(char){
		let name = htmlGen.createLink(
			false,
			{
				href : this.getBaseUrl()+"characters/"+char.code,
				text : char.name
			}
		);
		let row = {}
		if(char.isTurn && char.isTurn==="1"){
			row.cssClass = "success";
			char.isTurn = "Yes";
		} else {
			char.isTurn = "No";
		}
		row.row = [
			name,
			char.isTurn,
			char.turnOrder
		];
		return row;
	},
	unload : ()=>$(".battleListHide").off("click")
	
})
