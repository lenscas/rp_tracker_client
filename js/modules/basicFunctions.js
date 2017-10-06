funcs = {
	findCorrectMods : function(modifiers,charCode,modTypeId,asArray=false){
		let total=0;
		if(asArray){
			total = [];
		}
		modifiers.forEach(mod=>{
			if(mod.code==charCode && mod.statId==modTypeId){
				if(asArray){
					total.push(mod);
				} else {
					total = total + Number(mod.value)
				}
				
			}
		});
		if(!asArray){
			total = total.toString();
		}
		return total;
	}
}
