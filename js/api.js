api = {
	call : function(data){
		if(data.followURL){
			data.complete = function(jqXHR,status){
				console.log(jqXHR);
				if(status==="error"){
					if(jqXHR.responseJSON){
						console.log(jqXHR.responseJSON.errors);
						$.each(
							jqXHR.responseJSON.errors,
							element => {alertManager.show(element)}
						);
					} else {
						alertManager.show("Something went wrong. :(");
					}
					
				}
				console.log(status);
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
		console.log(data.followURL);
		this.call(data);
	},
	get :function(data){
		data.followURL = false
		data.method    = "GET"
		this.call(data);
	}
}
