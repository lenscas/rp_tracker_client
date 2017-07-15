pageHandler = {
	pageHolder : "#pageHolder",
	pageCode   : {},
	activePage : "",
	enablePage : function (route){
		console.log(route);
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
		this.bindEvents(id);
	},
	registerPageCode : function(newCode){
		this.pageCode[this.activePage] = newCode;
		this.bindEvents(this.activePage);
	},
	loadCode : function(pathPart){
		$("head").append('<script src="'+ conf.base_url+'js/pageCode/'+pathPart+'.js"></script>');
	},
	bindEvents : function(id) {
		this.pageCode[id] && this.pageCode[id].bindEvents && this.pageCode[id].bindEvents();
	}
}
