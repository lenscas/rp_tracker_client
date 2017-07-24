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
	},
	createTable : function(selector,data){
		const el      = $(selector);
		const head    = $("<thead></thead>");
		const headRow = $("<tr></tr>").appendTo(head);
		const body    = $("<tbody></tbody>");
		const table   = $("<table></table>")
			.addClass(data.head.cssClass || "")
			.append(head)
			.append(body)
		el.append(table);
		data.head.row.forEach( value =>{
			let cssClass= "";
			let name    = value;
			if(typeof(value) === "object"){
				cssClass = value.cssClass || "";
				name     = vale.name || "";
			}
			headRow.append(
				$("<th></th>")
					.addClass(cssClass)
					.append(name)
			);
		});
		data.rows.forEach(row => {
			const curRow = $("<tr></tr>").appendTo(body);
			let rows = row;
			if(!Array.isArray(row)){
				rows = row.row;
				curRow.addClass(row.cssClass);
			}
			
			rows.forEach(cell => {
				let content  = cell;
				let cssClass = ""
				if((typeof(cell) == "object") && cell.content){
					content  = cell.content
					cssClass = cell.cssClass || "";
				}
				$("<td></td>")
					//will probably get expanded
					.append(content)
					.addClass(cssClass)
					.appendTo(curRow);
			});
		});
		return table
	},
	createLink :function(selector,data){
		let href     = conf.base_url + data.href || "";
		let text     = data.text || "";
		let cssClass = data.cssClass || "";
		let a        = $('<a class="newPage"></a>')
			.append(text)
			.attr("href",href)
			.addClass(cssClass);
		if(selector){
			a.appendTo($(selector));
		}
		return a;
	}
}
