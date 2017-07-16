pageHandler = {
	pageHolder : "#pageHolder",
	pageCode   : {},
	activePage : "",
	goTo       : function(url){
		console.log("url " +url);
		let foundRoute     = false;
		let possibleRoutes = [];
		let at = 0;
		url = url.split("/");
		Object.keys(routes)
			.forEach(
				value => possibleRoutes.push(
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
			Object.keys(possibleRoutes).length >0 && 
			at<= url.length
		){
			console.log(routes);
			let newPossibleRoutes=[];
			Object.keys(possibleRoutes).some((value,key) => {
				let found = false
				console.log("each");
				console.log(value);
				if(value.url[at] =="(:any)"){
					console.log("test");
					possibleRoutes[key].foundParams.push(url[at]);
					found= true
				} else if (value.url["at"]==url[at]){
					found=true
				}
				if(found){
					newPossibleRoutes.push(possibleRoutes[key]);
					console.log(at + " " +url.length);
					if(at===url.length){
						console.log("test");
						found=possibleRoutes[key];
						return false;
					}
				}
			})
			possibleRoutes=newPossibleRoutes;
			at = at+1
			console.log("at "+at);
		}
		console.log("out of while");
		if(foundRoute){
			console.log(found);
			console.log(routes[found.url.join("/")]);
			//this.enablePage(route[found]);
		}
	},
	enablePage : function (route){
		const el = $("#"+route[1]);
		this.hideAllPages();
		activePage = route[1]
		if(el.length===0){
			console.log(conf.pages+route[0]+".html")
			$('<div id="'+ route[1] +'"></div>').appendTo(this.pageHolder).load(
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
	loadCode : function(pathPart){
		$("head")
			.append('<script src=""></script>')
			.attr("src",conf.base_url+'js/pageCode/'+pathPart+'.js');
	},
	initCode : function(id){
		this.bindEvents(id);
		this.startUp(id);
	},
	bindEvents : function(id) {
		this.pageCode[id] && 
		this.pageCode[id].bindEvents && 
		this.pageCode[id].bindEvents();
	},
	startUp : function(id){
		console.log("awesome" && "less awesome");
		this.pageCode[id] && t
		his.pageCode[id].startUp && 
		this.pageCode[id].startUp();
	}
}
