function modFormHelper(data){
	this.rpCode   = data.rpCode;
	this.modList  = data.modList;
	this.charCode = data.charCode;
	this.statId   = data.statId;
	this.callBack = data.callBack;
	console.log(this);
}
modFormHelper.prototype.createTableData = function(){
	let tableData  = {
		head : {
			row : ["Name","Amount","Time left","Update","Delete"],
			cssClass : "table"
		},
		rows : []
	}
	console.log(this.modList);
	this.modList.forEach(
		value=>tableData.rows.push({
			data : {name:"mod-id",value:value.modifiersId},
			row  : [
				$('<input>')
					.attr("name","name")
					.prop("required",true)
					.addClass("form-control modName")
					.val(value.name),
				$('<input>')
					.attr("name","value")
					.prop("required",true)
					.addClass("form-control modValue")
					.attr("type","number")
					.val(value.value),
				$('<input>')
					.val(value.countDown)
					.prop("required",true)
					.addClass("form-control modCountDown")
					.attr("type","number")
					.attr("name","countdown"),
				$('<button>Update</button>')
					.addClass("btn btn-success")
					.addClass("characterListModiferUpdate"),
				$('<button>Delete</button>')
					.addClass("btn btn-danger")
					.addClass("characterListModiferDelete")
			]
		})
	);
	tableData.rows.push({
		data : {name:"stat-id",value:this.statId},
		row  : [
			$('<input>')
				.attr("name","name")
				.prop("required",true)
				.addClass("form-control modName"),
			$('<input>')
				.attr("name","value")
				.prop("required",true)
				.addClass("form-control modValue")
				.attr("type","number")
				.val(0),
			$('<input>')
				.val(0)
				.addClass("form-control modCountDown")
				.prop("required",true)
				.attr("type","number")
				.attr("name","countdown"),
			$('<button>Create</button>')
				.addClass("btn btn-success")
				.addClass("characterListModiferCreate"),
			""
		]
	});
	return tableData;
}
modFormHelper.prototype.createForm = function(data){
	data.bindEvents = !("bindEvents" in data) || data.bindEvents;
	const tableData = this.createTableData();
	const table = htmlGen.createTable(
		$(data.container).empty(),
		tableData
	);
	if(data.modal){
		$(data.modal).modal();
	}
	if(data.bindEvents){
		this.bindEvents(this.callBack);
	}
}
modFormHelper.prototype.getModInputValues =function(row){
	const data = {
		name      : row.find(".modName").val(),
		value     : row.find(".modValue").val(),
		intName   : row.data("stat-id"),
		countDown : row.find(".modCountDown").val()
	};
	if(!Object.keys(data).every(value=>data[value]!=="")){
		alertManager.show("not all fields are set");
		return;
	};
	return data;
}
modFormHelper.prototype.bindEvents = function(callBack){
	const that = this;
	console.log(callBack);
	$(".characterListModiferUpdate").on("click",function(event){
		event.preventDefault();
		const el = $(this);
		const row = el.closest("tr");
		const modId = row.data("mod-id");
		const data = that.getModInputValues(row);
		console.log(data);
		if(!data){
			return;
		}
		api.put({
			url : "rp/"+that.rpCode+"/characters/"+that.charCode+"/modifiers/"+modId,
			data: data,
			callBack : callBack
		});
	});
	$(".characterListModiferCreate").on("click",function(event){
		event.preventDefault();
		const el = $(this);
		const row = el.closest("tr");
		const data = that.getModInputValues(row);
		console.log("lets update?");
		console.log(data);
		if(!data){
			return;
		}
		api.post({
			url : "rp/"+that.rpCode+"/characters/"+that.charCode+"/modifiers",
			data : data,
			callBack : callBack,
		});
	});
	$(".characterListModiferDelete").on("click",function(event){
		const el = $(this);
		const row = el.closest("tr");
		const modId = row.data("mod-id");
		api.delete({
			url : "rp/"+that.rpCode+"/characters/"+that.charCode+"/modifiers/"+modId,
			callBack : callBack
		})
	});
}
