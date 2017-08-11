codeHandler.registerPageCode({
	drawRPTable : function(selector,data){
		$(selector).empty();
		let tableData = {
			head : {
				row      : ["name","description"],
				cssClass : "table table-striped"
			},
			rows : []
		}
		data.forEach((value,key)=> {
			tableData.rows[key] = [
				htmlGen.createLink(
					false,
					{
						href : "rp/"+value.code,
						text : value.name
					}
				),
				{
					content  : value.description,
					cssClass : "compressedTableHighed"
				}
			]
		});
		htmlGen.createTable(
			selector,
			tableData
			
		).DataTable({
			"pageLength": 5
		});
	},
	startUp : function(pageParams){
		simpleEvents.togglePanelShow(".profileCollapseablePanel","click");
		let that = this;
		api.get({
			url      : "users/"+pageParams[0],
			callBack : function (xhr,status){
				const data = xhr.responseJSON;
				$("#profileUserName").text(data.userData.username);
				that.drawRPTable("#profileMadeRoleplaysContainer",data.madeRPs);
				that.drawRPTable("#profileJoinRoleplaysContainer",data.joinedRPs);
				simpleEvents.togglePanelShow(".profileCollapseablePanel","on");
			}
		})
	},
	unload :()=>$(".profileCollapseablePanel").off("click")
	
})
