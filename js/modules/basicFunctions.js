funcs = {
	findMods : function(mods,charCode,searchMod=false){
		let returnData = {};
		mods.forEach(mod=>{
			if(mod.code===charCode){
				const statName = mod.intName
				if(searchMod && statName!==searchMod){
					return;
				}
				returnData[statName] = returnData[statName] || {
					base : 0,
					both : 0,
					mods : 0,
					list :[],
				};
				const value=Number(mod.value);
				if(mod.isBase){
					returnData[statName].base = returnData[statName].base + value;
				} else {
					returnData[statName].mods = returnData[statName].mods + value;
				}
				returnData[statName].list.push(mod);
				returnData[statName].both = returnData[statName].both + value;
			}
		});
		if(searchMod){
			returnData =returnData[searchMod];
		}
		return returnData;
	}
	
}
