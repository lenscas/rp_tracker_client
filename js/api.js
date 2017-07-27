api = {
	call : function(data){
		//define basic actions based on the return code
		data.statusCode = data.statusCode || {}
		data.statusCode[403] = data.statusCode[403] ||(
			() =>pageHandler.goTo(conf.base_url+"login")
		);
		//set more complex behavior based upon the json response and the configuration
		if(data.followURL){
			data.complete = function(jqXHR,status){
				if(status==="error"){
					//if(this[jqxhr.)
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
		if(!data.complete && data.callBack){
			data.complete = (jqXHR,status)=>{data.callBack(jqXHR,status)};
		}
		data.dataType  = "json";
		data.url       = conf.api+data.url;
		$.ajax(data);
	},
	post : function(data){
		data.method    = "POST";
		data.followURL = data.followURL == null || data.followURL
		this.call(data);
	},
	get :function(data){
		data.followURL = false
		data.method    = "GET"
		this.call(data);
	}
}
