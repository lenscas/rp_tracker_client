pageHandler.registerPageCode({
	startUp : function(pageParams){
		api.get({
			url      : "users/"+pageParams[0],
			callBack : function (xhr,status){
				const data = xhr.responseJSON;
				$("#profileUserName").text(data.userData.username);
				let tableData = {
					head : {
						row      : ["name","description"],
						cssClass : "table table-striped"
					},
					rows : []
				}
				data.madeRPs.forEach((value,key)=> {
					tableData.rows[key] = [
						value.name,
						{
							content  : value.description,
							cssClass : "compressedTableHighed"
						}
					]
				});
				htmlGen.createTable(
					"#profileMadeRoleplaysContainer",
					tableData
					
				);
				console.log(xhr);
			}
		})
	}
	
})
