pageHandler = {
	pageHolder    : "#pageHolder",
	pageCode      : {},
	activePage    : "",
	curPageParams : [],
	goTo          : function(url,addUrl=true){
		let foundRoute     = false;
		let possibleRoutes = [];
		let at = 0;
		addUrl && history.pushState({url : url},"",url);
		url = url.replace(conf.base_url,"").split("/");
		Object.keys(routes)
			.forEach(
				value => value.split("/").length === url.length && 
				possibleRoutes.push(
					{
						url         : value.split("/"),
						id          : routes[value][1],
						page        : routes[value][0],
						foundParams : []
					}
				)
			);
		while(
			!foundRoute && 
			possibleRoutes.length >0 && 
			at<= url.length
		){
			let newPossibleRoutes=[];
			possibleRoutes.some((value,key) => {
				let found = false
				if(value.url[at] =="(:any)" && url[at]){
					possibleRoutes[key].foundParams.push(url[at]);
					found= true
				} else if (value.url[at]==url[at]){
					found=true
				}
				if(found){
					newPossibleRoutes.push(possibleRoutes[key]);
					if(at===url.length -1){
						foundRoute=possibleRoutes[key];
						return true;
					}
				}
			})
			possibleRoutes=newPossibleRoutes;
			at = at+1
		}
		if(foundRoute){
			foundRoute.url = foundRoute.url.join("/");
			this.enablePage(foundRoute);
		}
	},
	enablePage : function (urlData){
		alertManager.removeAllAlerts();
		const route = routes[urlData.url]
		const el = $("#"+route[1]);
		this.curPageParams = urlData.foundParams;
		this.hideAllPages();
		activePage = route[1]
		if(route.length>=3){
			menuManger.setWatchingRP(urlData.foundParams[route[2]]);
		}
		if(el.length===0){
			$('<div id="'+ route[1] +'"></div>')
				.appendTo(this.pageHolder)
				.load(
					conf.pages+route[0]+".html",
					function(responce,status,xhr){
						if(status==="error"){
							alert("there was an error!");
							console.log(responce);
							console.log(status);
							console.log(xhr);
						}
					}
				)
		} else {
			this.renderPage(route[1])
		}
	},
	hideAllPages : function(){
		$(this.pageHolder).find("div").hide().find("*").off();
	},
	renderPage : function (id){
		this.hideAllPages();
		$("#"+id).show();
		this.initCode(id);
	},
	registerPageCode : function(newCode){
		this.pageCode[this.activePage] = newCode;
		this.initCode(this.activePage);
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
	}
}
window.onpopstate = event => pageHandler.goTo(event.state.url);
