function AbilityTableHelper(data){
	this.abilities  = data.abilities;
	this.container  = data.container;
}
AbilityTableHelper.prototype.createTable =function(){
	let tableData = {
		head : {
			row : ["Character","Ability","countDown","cooldown"],
			cssClass : "table"
		},
		rows : []
	}
	this.abilities.forEach(
		value => tableData.rows.push(
			[
				value.name,
				value.abilityName,
				value.countDown,
				value.cooldown
			]
	));
	const table = htmlGen.createTable(
		this.container,
		tableData
	)
	table.dataTable();
	return table;
}
