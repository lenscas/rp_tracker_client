//this function is used to more easily generated often used HTML
htmlGen = {
	//given a string, it capitalizes the first letter.
	//though not strictly html
	//it is used by other functions in this object and can be useful at other places as well
	capitalizeFirstLetter : function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	//used to create the inputs of a form. 
	//Selector refers to where it should be appended to
	//data is an object with form data
	createForm : function(selector,data){
		let el = $(selector);
		const idPrefix = data.idPrefix || "form"+Math.random();
		data.inputs = data.inputs || [];
		//loop over all the inputs that need to be created
		data.inputs.forEach(value =>{
			input = {
				name : value.input.name,
				id : value.input.id || idPrefix+value.input.name,
				type : value.input.type || "text",
				options : value.input.options || [],
				isFancy : !("isFancy" in value.input) || value.input.isFancy,
				placeholder : value.input.placeholder || 
					this.capitalizeFirstLetter(value.label),
				isRequired  : !( "required" in value.input) || value.input.required,
				value : "value" in value.input ? value.input.value.toString() :"",
				cssClass : value.input.cssClass || ""
			}
			let inputGroup = $('<div class="form-group row"></div>')
				.append(
					$('<label>'+value.label+'</label>')
					.attr("for",input.id)
					.addClass("col-sm-3 col-form-label")
				);
			let inputContainer = $('<div class="col-sm-9"></div>');
			newInput = this.createInput(input)
				.addClass("form-control")
				.addClass(input.cssClass)
				.attr("type",input.type)
				.attr("id", input.id)
				.prop("required", input.isRequired)
				.attr("name",input.name);
			if(input.value){
				newInput.val(input.value);
			}
			inputContainer.append(newInput).appendTo(inputGroup);
			inputGroup.appendTo(el);
		});
		//add the submit button
		if(!data.button){
			return;
		}
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
	createInput : function(input){
		let newInput;
		switch(input.type){
			case "select" :
				newInput = $('<select></select>')
				input.options.forEach(value =>{
					newInput.append(
						$('<option></option>')
							.attr("value",value.value)
							.html(value.text)
					);
				});
				break;
			case "textarea" :
				newInput = $('<textarea></textarea>').html(input.placeholder);
				if(input.isFancy){
					console.log("It should be a fancy editor");
				}
				break;
			default :
				newInput = $('<input>')
					.attr("type",input.type)
					.attr("placeholder",input.placeholder);
				break;
		}
		return newInput;
		
	},
	//this function is used to create a table
	createTable : function(selector,data){
		//first its time to create the very basics of a table
		//these get expanded later on
		const el      = $(selector);
		const head    = $("<thead></thead>");
		const headRow = $("<tr></tr>").appendTo(head);
		const body    = $("<tbody></tbody>");
		//now its time to actually create the table element 
		//and append the other pieces
		const table   = $("<table></table>")
			.addClass(data.head.cssClass || "")
			.append(head)
			.append(body)
		//put the table at the correct place
		el.append(table);
		//now its time to create the head of the table
		data.head.row.forEach( value =>{
			//first we set some variables to either what is given or their defaults
			let cssClass= "";
			let name    = value;
			if(typeof(value) === "object"){
				cssClass = value.cssClass || "";
				name     = value.name || value.text || "";
			}
			//now its time to add the <th> to the head row
			headRow.append(
				$("<th></th>")
					.addClass(cssClass)
					.append(name)
			);
		});
		//having done the head, its now time to fill in the body
		data.rows.forEach(row => {
			//first create a new row
			const curRow = $("<tr></tr>").appendTo(body);
			let rows = row;
			if(!Array.isArray(row)){
				rows = row.row;
				curRow.addClass(row.cssClass);
			}
			//now its time to create the cells in said row
			rows.forEach(cell => {
				//as always, first we declare some variables to either what is set or their defaults
				let content  = cell;
				let cssClass = ""
				if((typeof(cell) == "object") && cell.content){
					content  = cell.content
					cssClass = cell.cssClass || "";
				}
				//and then append it
				$("<td></td>")
					//will probably get expanded
					.append(content)
					.addClass(cssClass)
					.appendTo(curRow);
			});
		});
		return table
	},
	//used to create a link to another page in this application
	createLink :function(selector,data){
		//set some variables to either what got set or their defaults
		let href     = conf.base_url + (data.href || "");
		let text     = data.text || "";
		let cssClass = data.cssClass || "";
		//make the element, add the correct classes, attributes and text
		let a        = $('<a class="newPage"></a>')
			.append(text)
			.attr("href",href)
			.addClass(cssClass);
		//if an selector is given, add it to the correct element before returning it
		if(selector){
			a.appendTo($(selector));
		}
		return a;
	},
	createPanel : function(selector,data){
		const color = (data.color || "") && "panel-"+data.color;
		const title =  data.title || "";
		const text  =  data.text  || "";
		let panel = $('<div></div>')
			.addClass("panel "+color)
			.append(
				$('<div></div>')
					.addClass("panel-heading")
					.html(title)
			).append(
				$('<div></div>')
					.addClass("panel-body")
					.append(text)
			);
		if(selector){
			panel.appendTo(selector)
		}
		return panel;
	}
}
