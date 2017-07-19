pageHandler.registerPageCode({
	drawRPTable : function(selector,data){
		let tableData = {
			head : {
				row      : ["name","description"],
				cssClass : "table table-striped"
			},
			rows : []
		}
		data.forEach((value,key)=> {
			let a = $('<a class="newPage"></a>');
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
		console.log(tableData.rows);
		htmlGen.createTable(
			selector,
			tableData
			
		).DataTable({
			"pageLength": 5
		});
	},
	startUp : function(pageParams){
		let that = this;
		api.get({
			url      : "users/"+pageParams[0],
			callBack : function (xhr,status){
				const data = xhr.responseJSON;
				$("#profileUserName").text(data.userData.username);
				console.log(data.madeRPs);
				that.drawRPTable("#profileMadeRoleplaysContainer",data.madeRPs);
				that.drawRPTable("#profileJoinRoleplaysContainer",data.joinedRPs);
			}
		})
	}
	
})
