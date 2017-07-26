pageHandler.registerPageCode({
	startUp : function(pageParams){
		let that = this;
		api.get({
			url      : "rp/"+pageParams[0],
			callBack : function (xhr,status){
				console.log(xhr);
				if(status!=="success"){
					return;
				}
				const idPrefix = "#roleplayOverview";
				const data     = xhr.responseJSON;
				
				let   table    = $(idPrefix+"Config")
				let   charCon  = $(idPrefix+"Characters");
				console.log(table);
				$(idPrefix+"Desc").append(data.description.replace("\n","<br>"));
				
				table.append(
					$('<tr></tr>')
						.append(
							$('<td></td>')
								.append("Setting")
						)
						.append(
							$('<td></td>')
								.append(data.statSheetName)
						)
				).append(
					$('<tr></tr>')
						.append(
							$('<td></td>')
								.append("Abilities")
						)
						.append(
							$('<td></td>')
								.append(data.startingAbilityAmount)
						)
				).append(
					$('<tr></tr>')
						.append(
							$('<td></td>')
								.append("Stats amount")
						)
						.append(
							$('<td></td>')
								.append(data.startingStatAmount)
						)
				)
				data.characters.forEach(value => {
					let para = $("<p></p>").appendTo(charCon);
					htmlGen.createLink(
						para,
						{
							href : "rp/"+pageParams[0]+"/characters/"+value.code,
							text : value.name
						}
					);
				});
						
				
				//test
				//console.log("still in callback");
				console.log(xhr);
			}
		})
	}
})
