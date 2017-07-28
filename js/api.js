//this is used to easier make calls to the api
//all functions that make calls to the api are async. 
//Either include a callBack function (recommended)
//or use the standard functions for an ajax call (not recommended as the api uses those as well.)
api = {
	statusCodes : {
		noPermission : 403,
	},
	//this is used by the rest of the object. Though you can use it, you probably shouldn't
	call : function(data){
		//define basic actions based on the return code. 
		//If the user set their own functions we want to use those instead
		data.statusCode = data.statusCode || {}
		//add a function that redirects to the login page if we have no permission
		data.statusCode[this.statusCodes.noPermission] = 
			data.statusCode[this.statusCodes.noPermission] || (
				() =>pageHandler.goTo(conf.base_url+"login")
			);
		//if data.followURL is true set more complex data.
		if(data.followURL){
			data.complete = function(jqXHR,status){
				if(status==="error"){
					if(jqXHR.responseJSON){
						if(jqXHR.responseJSON.error){
							alertManager.show(
								jqXHR.responseJSON.error
							)
						} else if(jqXHR.responseJSON.errors){
							Object.keys(jqXHR.responseJSON.error)
								.forEach(value =>
									alertManager.show(
										jqXHR.responseJSON.error[value]
									)
							);
						}
					} else {
						alertManager.show("Something went wrong. :(");
					}
				}
				data.callBack && data.callBack(jqXHR,status);
			}
		}
		//if there is a callBack and data.complete is not set, make a function that always calls the callback
		if(!data.complete && data.callBack){
			data.complete = (jqXHR,status)=>{data.callBack(jqXHR,status)};
		}
		//add the last few missing things for a good ajax call
		data.dataType  = "json";
		data.url       = conf.api+data.url;
		//and now its time to actually do it
		$.ajax(data);
	},
	//used to make a POST request. Use this if you want to create something
	post : function(data){
		data.method    = "POST";
		data.followURL = data.followURL == null || data.followURL
		this.call(data);
	},
	//this is used to make a GET request. Use this if you want to get data
	get : function(data){
		data.followURL = false
		data.method    = "GET"
		this.call(data);
	}
}
