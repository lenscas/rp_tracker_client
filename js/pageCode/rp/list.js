pageHandler.registerPageCode({
	startUp : function(pageParams){
		let that = this;
		api.get({
			url      : "rp/",
			callBack : function (xhr,status){
				if(status!=="success"){
					return;
				}
				const data =xhr.responseJSON
				console.log(xhr);
				let table = {
					head : {
						row      : ["User","Description","actions"],
						cssClass : "table table-striped"
					},
					rows : []
				}
				data.forEach(
					(value,key) =>{
						console.log(value);
						
						let profContainer= $('<div></div')
							.addClass("compressedTableHighed");
						let profImage = $('<img>').attr("src",value.avatar)
							.addClass("imageCompressed");
						let profName  = $('<p></p>').append(value.username)
						let profLink  = htmlGen.createLink(
							false,
							{
								href     : "profile/"+value.userCode,
								text     : "",
							}
						);
						profLink.append(profImage).append(profName);
						profContainer.append(profLink);
						const button = htmlGen.createLink(
							false,
							{
								href     : "rp/"+value.code,
								text     : "View",
								cssClass : "btn btn-primary",
							}
						);
						table.rows[key] = {
							row : [
								profContainer.html(),
								value.description,
								button,
								
							],
							cssClass:"compressedTableHighed"
						}
					}
				)
				console.log(table);
				console.log($("#RPListTableHolder"));
				console.log(htmlGen.createTable("#RPListTableHolder",table));
			}
		})
	},
	bindEvents : () =>{
		$("#RPListTableHolder").on("click","tr",function(event){
			$(this).toggleClass("compressedTableHighed");
		});
	}
})
