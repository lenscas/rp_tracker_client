function expandInputs(data){
	this.container      = data.container;
	this.inputFieldData = data.inputFieldData;
	this.addPanel       = data.addPanel || false;
	this.panelList =[];
	this.inputClass="expandableInputsExtraField";
	this.useingInputSelector = "."+this.inputClass;
	this.inputCount = 0;
	
	this.createInput();
	this.bindEvents();
}
expandInputs.prototype.createInput=function(){
	let container;
	if(this.addPanel){
		const panel = htmlGen.createPanel(
			this.container,
			this.addPanel
		)
		this.panelList.push(panel);
		container = panel.find(".panel-body");
	} else {
		container = this.container
	}
	//make a deep clone
	let inputData = JSON.parse(JSON.stringify(this.inputFieldData));
	if(inputData.baseName){
		inputData.inputs.forEach(
			(value,key)=>{
				inputData.inputs[key].input.name =
					this.inputFieldData.baseName+
					"["+this.inputCount+"]"+
					"["+value.input.name+"]";
				inputData.inputs[key].input.cssClass =
					this.inputClass +
					" "+
					(inputData.inputs[key].input.cssClass || "") ;
			}
		)
		delete inputData.baseName;
	}
	htmlGen.createForm(
		container,
		inputData
	);
	this.inputCount++;
}
expandInputs.prototype.removeUnsetFields = function(){
	if(this.addPanel){
		let newPanelList = []
		this.panelList.forEach(
			value=>{
				const panel = this.removeEmptyGroup(value);
				panel && newPanelList.push(panel);
			}
		);
		this.panelList=newPanelList;
	}
}
expandInputs.prototype.removeEmptyGroup = function(panel){
	let allEmpty = true;
	panel.find(this.useingInputSelector).each(function(){
		const el = $(this);
		if(el.val()!==""){
			allEmpty=false;
			return false;
		}
	});
	if(allEmpty){
		panel.remove();
		return false;
	} else {
		return panel;
	}
}
expandInputs.prototype.bindEvents=function(){
	const that = this;
	$(this.container).on("change",this.useingInputSelector,function(){
		if(that.addPanel){
			that.removeUnsetFields();
		} else {
			$("container").find(this.useingInputSelector).each(function(){
				const el  = $(this);
				const val = el.val();
				if(val===""){
					el.closest(".createBattleCharSelectContainer").remove();
				}
			})
		}
		that.createInput();
	});
}

