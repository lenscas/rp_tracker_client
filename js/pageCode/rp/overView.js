codeHandler.registerPageCode({
	startUp : function(pageParams){
		let that = this;
		api.get({
			url      : "rp/"+pageParams[0],
			callBack : function (xhr,status){
				if(status!=="success"){
					return;
				}
				const idPrefix = "#roleplayOverview";
				const data     = xhr.responseJSON.data;
				
				let   table    = $(idPrefix+"Config").empty();
				let   charCon  = $(idPrefix+"Characters").empty();
				$(idPrefix+"Desc")
					.empty()
					.append(data.description.replace("\n","<br>"));
				
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
			}
		})
	}
})
