//this function handels loading other pages, loading code for those pages and going to said pages
pageHandler = {
	pageHolder    : "#pageHolder",
	activePage    : "",
	//given an url, this function will grab the correct html and display it
	//similar to what normally happens when you click on a link
	//using the addUrl param we can change if we want the url in the browser to be updated as well
	goTo          : function(url,addUrl=true){
		//used to check if we have an url that fits
		let foundRoute     = false;
		//list of all the possible routes
		let possibleRoutes = [];
		//used to keep track at where we are in the url comparison
		let at = 0;
		//add the given url to the history if addUrl=true
		addUrl && history.pushState({url : url},"",url);
		//we split the url into an array on the "/" sign to make it easier to compare
		url = url.replace(conf.base_url,"").split("/");
		//make the list of all the routes that the given url can refer to
		Object.keys(routes)
			.forEach(
				//check if the urls are of equal length before pushing it into the array
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
		//now its time to look for the correct route.
		//we continue this loop for as long as
		while(
			//there isn't a route found
			!foundRoute && 
			//and there are still options left
			possibleRoutes.length >0 &&
			//and we haven't gone through all the url parts
			at<= url.length
		){
			//make a new list of possibleRoutes
			let newPossibleRoutes=[];
			//then loop over the current possible routes
			//stopping automatically if we return true
			possibleRoutes.some((value,key) => {
				let found = false
				//if the current route part is (:any) we only care if the given url has something
				//else its true by default as (:any) refers to literally anything
				if(value.url[at] =="(:any)" && url[at]){
					//the part that (:any) refers to gets added to the parameters
					possibleRoutes[key].foundParams.push(url[at]);
					found= true
				//check if the parts are equal
				} else if (value.url[at]==url[at]){
					found=true
				}
				//if the route still fit the given url
				//add it to the newPossibleRoutes list
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
			//join the url back up before actually rendering the next function
			foundRoute.url = foundRoute.url.join("/");
			this.enablePage(foundRoute);
		}
	},
	//this function actually renders the page
	enablePage : function (urlData){
		//first, remove all the current alerts.
		//As they become irrelevant on the new page
		alertManager.removeAllAlerts();
		//get the route data, along with the element that this page should be stored in
		const route = routes[urlData.url]
		const el = $("#"+route[1]);
		//change the pageParameters to the ones we currently have and hide all the pages.
		this.hideAllPages();
		codeHandler.unloadCode(this.activePage,this.curPageParams);
		codeHandler.curPageParams = urlData.foundParams;
		this.activePage = route[1]
		//if the third parameter is set in the route, update the menu
		if(route.length>=3){
			menuManger.setWatchingRP(urlData.foundParams[route[2]]);
		}
		//if the element that stores the page does not exist yet we want to load it in
		//note: this is done ASYNC
		//note that if the page needs to be loaded we do not need to call renderPage
		//this is because the loaded html is visible the moment it is loaded
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
			//used to make the page visible if it was previously loaded and executes the correct code
			this.renderPage(route[1])
		}
	},
	hideAllPages : function(){
		$(this.pageHolder).children("div").hide().find("*").off();
	},
	renderPage : function (id){
		this.hideAllPages();
		$("#"+id).show()
		codeHandler.initCode(id);
	},
}
window.onpopstate = event => pageHandler.goTo(event.state.url);
