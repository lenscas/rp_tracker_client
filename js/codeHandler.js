codeHandler = {
	pageCode      : {},
	curPageParams : [],
	loadedDeps    : {},
	loadedHTMLDeps: {},
	//if a page is loaded and needs js to run it needs to call this function 
	//with an object containing the code that needs to run
	registerPageCode : function(newCode){
		if(this.pageCode[pageHandler.activePage]){
			console.log("something got bugged. RESET EVERYTHING!");
			pageHandler.removePages();
			codeHandler.pageCode = {};
			
		}
		this.pageCode[pageHandler.activePage] = newCode;
		const deps = {
			js   : newCode.dependencies || [],
			html : newCode.depsHTML     || [],
		}
		let callBack = (()=>this.initCode(pageHandler.activePage))
		if(newCode.once){
			callBack = (()=>{
				newCode.once();
				this.initCode(pageHandler.activePage)
			})
		}
		this.loadDependencies(deps,callBack);
	},
	loadDependencies : function(deps,callBack){
		deps = !Array.isArray(deps) ? deps :{js :deps } ;
		let strippedList = {html :[], js : []};
		Object.keys(deps).forEach(key => {
			deps[key].forEach(
				dep => strippedList[key].push(dep)
			);
		});
		const that = this;
		const check = function(value,kind){
			if(!kind){
				this.counter=0;
				this.max = 0;
				Object.keys(strippedList).forEach(
					value => {
						this.max = this.max +strippedList[value].length
					}
				);
			} else {
				this.counter++;
				if(kind==="js"){
					that.loadedDeps[value]=true;
				} else {
					that.loadedHTMLDeps[value]=true;
				}
			}
			this.counter===this.max && callBack();
		}
		check();
		//this actually loads all the dependencies.
		strippedList.js.forEach(
			value => $.getScript(
				conf.js+"modules/"+value+".js",
				()=>check(value,"js")
			)
		);
		strippedList.html.forEach(
			value => $("#htmlDepsContainer").load(
				conf.base_url + "html/"+value+".html",
				()=>check(value,"html")
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
