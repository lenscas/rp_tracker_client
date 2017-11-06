battleSystems = (typeof battleSystems!=="undefined") ? battleSystems : {
	loading : {},
	loaded : {},
	callBacks : {},
	counter : 0,
	load : function(name,callback){
		if(name==="CUST"){
			callBack();
			return;
		}
		console.log(this.loaded[name]);
		console.log(this.loading[name]);
		if(this.loaded[name]){
			return callback(this.loaded[name]);
		}
		this.callBacks[name] = this.callBacks[name] || [];
		this.callBacks[name].push(callback);
		if(!this.loading[name]){
			this.loading[name]   = true;
			$.getScript(
				conf.base_url+"js/rollDefaultActions/"+name+".js",
			);
		}
		
		

	},
	register : function(name,code){
		this.loaded[name]=code;
		delete this.loading[name];
		(this.callBacks[name] || []).forEach(
			value=>{
				value(this.loaded[name])
				delete value;
			}
		);
	}
}
