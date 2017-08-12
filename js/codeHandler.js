codeHandler = {
	pageCode      : {},
	curPageParams : [],
	loadedDeps    : {},
	//if a page is loaded and needs js to run it needs to call this function 
	//with an object containing the code that needs to run
	registerPageCode : function(newCode){
		this.pageCode[pageHandler.activePage] = newCode;
		if(newCode.dependencies){
			let callBack = (()=>this.initCode(this.activePage))
			if(newCode.once){
				callBack = (()=>{newCode.once();this.initCode(this.activePage)})
			}
			this.loadDependencies(newCode.dependencies,callBack);
		} else {
			console.log("??");
			newCode.once && newCode.once();
			this.initCode(pageHandler.activePage);
		}
		
	},
	loadDependencies : function(depList,callBack){
		//first, loop over the list so we can strip away what is already loaded
		let strippedList = [];
		depList.forEach(
			value=>(!this.loadedDeps[value]) && strippedList.push(value)
		);
		if(strippedList.length===0){
			callBack();
		}
		//the counter is a way to check how many modules from the list have been loaded
		//if the amount is equal to the amount of dependencies that should have been loaded we have them all
		let counter = 0;
		//this actually loads all the dependencies.
		strippedList.forEach(
			value => $.getScript(
				conf.js+"modules/"+value+".js",
				//this checks if we have loaded all the dependencies and checks if we 
				()=>{
					counter++;
					this.loadedDeps[value]=true;
					counter===strippedList.length && callBack();
				}
			)
		);
	},
	loadCode : function(pathPart,callback){
		$.getScript(conf.js+"pageCode/"+pathPart+".js",callback);
	},
	initCode : function(id){
		this.startUp(id,this.curPageParams);
		this.bindEvents(id,this.curPageParams);
	},
	bindEvents : function(id,params) {
		this.pageCode[id] && 
		this.pageCode[id].bindEvents && 
		this.pageCode[id].bindEvents(params);
	},
	startUp : function(id,params){
		this.pageCode[id] &&
		this.pageCode[id].startUp && 
		this.pageCode[id].startUp(params);
	},
	unloadCode : function(id,params){
		this.pageCode[id] &&
		this.pageCode[id].unload && 
		this.pageCode[id].unload(params);
	},
	rerun : function(){
		this.initCode(pageHandler.activePage);
	}
}
