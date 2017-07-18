htmlGen = {
	capitalizeFirstLetter : function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	createForm : function(selector,data){
		let el = $(selector);
		data.inputs.forEach(value =>{
			let id          = value.input.id || value.input.name;
			let type        = value.input.type || "text";
			
			let placeholder = value.input.placeholder || 
				this.capitalizeFirstLetter(value.input.name);
				
			let isRequired  = value.input.required==undefined || 
				value.input.required;
			
			
			el.append(
				$('<div class="form-group row"></div>')
					.append(
						$('<label>'+value.label+'</label>')
						.attr("for",id)
						.addClass("col-sm-3 col-form-label")
					).append(
						$('<div class="col-sm-9"></div>')
							.append(
								$('<input>')
									.addClass("form-control")
									.attr("type",type)
									.attr("id", id)
									.attr("placeholder", placeholder)
									.prop("required", isRequired)
									.attr("name",value.input.name)
							)
					)
			);
		});
		el.append(
			$('<div class="form-group row"></div>')
				.append(
					$('<div class="col-sm-offset-8 col-sm-4 text-right"></div>')
						.append(
							$('<button type="submit"></button>')
								.addClass("btn btn-"+data.button.color)
								.html(data.button.text || "Create")
						)
				)
		);
	}
}
