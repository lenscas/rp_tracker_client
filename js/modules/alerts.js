alerts = (function(){
	const alertObj = {
		init : function(callBack){
			codeHandler.loadDependencies(["socket"],()=>{
				$("#retryGetAlerts").hide();
				socket.registerOnFail(()=>{
					console.log("??");
					$("#noServer").show();
					$("#alertContainer").hide();
					console.error("Connection failed!");
				});
				socket.registerOnOpen(()=>{
					$("#alertContainer").show();
					socket.send({
						route : ["alerts","getUnwatchedAlerts"],
						callBack : (data)=>{
							this.empty();
							data.alerts.forEach(alert=>this.handleNewAlert(alert));
						}
					});
				});
				socket.registerEvent(
					"notification/get",
					(data)=>this.handleNewAlert(data)
				);
				callBack();
			})
		},
		handleNewAlert : function(alert){
			if(alertTypeHandlers[alert.type]){
				alertTypeHandlers[alert.type](alert);
			} else {
				console.error(alert.type + " is not supported! Going to fallBack!");
				alertFallBack(alert)
			}
		},
		empty : function(){
			$("#alertMenu").empty();
		},
		render : function(alert){
			console.log(alert);
			$("#alertMenu").prepend(
				$('<li></li>').html('<p>'+alert.message+'</p>').data("id",alert.alertId)
			);
		}
	};
	const alertFallBack = function(alert){
		//used to change some variables to a more friendly format
		//for example to change an userId to a username
		const toProcessVars = {
			"USERID"   : {
				url    : ["users","USERID"], //where to get the info
				newVar : "USERNAME",         //how the new variable is called in the message
				key    : ["userData","username"],       //where to find the value in the returned data.
			},
			"RP_CODE"  : {
				url    : ["rp","RP_CODE"],
				newVar : "RP_NAME",
				key    : ["name"]
			},
			"CHARCODE" : {
				url    : ["rp","RP_CODE","characters","CHARCODE"],
				newVar : "CHARACTER_NAME",
				key    : ["character","name"]
			}

		}
		//we will need the variable names and their values a lot.
		//this is used so we can more easily grab them instead of looping over the set vars every time.
		const names = {};
		console.log(alert);
		alert.vars.forEach(vari =>names[vari.name] = vari.value);
		//recursive function that will go over each set variable and use the toProcessVars object to get the more readable versions
		const processVars = function(callBack,atVar,proccesedVars){
			atVar = atVar || 0; //marks at which variable we are
			proccesedVars = proccesedVars || {}; //all variables we have access to, similair stored as the names object
			//looks if we have had them all
			if(atVar>=alert.vars.length){
				return callBack(proccesedVars); //we did, so lets call the callback
			}
			proccesedVars[alert.vars[atVar].name] = alert.vars[atVar].value;
			//we will need the name of the variable a lot more. Lets make it quicker to access it.
			const processingVar = alert.vars[atVar].name;
			//checks if we know how to make it more readable.
			//If we do, we will process it. Else, just add it to the new list
			if(toProcessVars[processingVar]){
				const toProcessData = toProcessVars[processingVar]; //a reference to the data needed to get our human readable variable
				const url = []; //the url with all variables changed to their values
				//this constructs the url by replacing all variables in it with real values.
				toProcessData.url.forEach(value=>{
					if(names[value]){
						url.push(names[value]);
					} else {
						url.push(value);
					}
				})
				//time to get our new data
				api.get({
					url : url.join("/"), //remember, it was an array before but we need a string
					callBack : function(data,status){
						if(status!=="success"){
							return
						}
						//get the value we need
						data = data.responseJSON.data
						toProcessData.key.forEach(value=>data = data[value]);
						//add it to our list and go to the next variable that needs to be proccesed.
						proccesedVars[toProcessData.newVar] = data;
						processVars(callBack,atVar+1,proccesedVars); //RECURSION!
					}
				})
				return; //we are done, until our ajax calls returns.
			} else {
				//add it to the list and call ourselves again to process the next variable
				proccesedVars[alert.vars[atVar]] = processingVar;
				return processVars(callBack,atVar+1,proccesedVars);
			}
		}
		//lets activate our asynchronous recursive function.
		processVars(
			proccesedVars => {
				const messageExtensions = {
					USERNAME         : "profile/{USERID}",
					RP_NAME        : "rp/{RP_CODE}",
					CHARACTER_NAME : "rp/{RP_CODE}/characters/{CHARCODE}"
				}
				Object.keys(messageExtensions).forEach(value=>{
					const link = '<a href="'+conf.base_url+messageExtensions[value]+'" class="newPage">{'+value+'}</a>';
					alert.message = alert.message.split("{"+value+"}").join(link);
				})
				//loop over all the variables and check the string to replace the set variables with our values.
				Object.keys(proccesedVars || {}).forEach(value => {
					alert.message = alert.message.split("{"+value+"}").join(proccesedVars[value]);
				})
				alertObj.render(alert); //Finally,time to render the alert.
			}
		)

	}
	const alertTypeHandlers = {
		test : function(alert){
			api.get({
				url : "users/"+alert.vars.USERCODE+"/username",
				success : (data,status)=>{
					alert.message = alert.message.replace("{USERCODE}",data.data.username);
					alertObj.render(alert);
				}
			})
		}
	}
	$("#alertContainer").on("click",function(e){
		console.log("??");
		const idList = []
		$("#alertMenu").find("li").each(function(){
			console.log("what?");
			console.log($(this));
			idList.push($(this).data("id"));
		});
		console.log(idList);
		socket.send({
			route :["alerts","setWatched"],
			data : {
				ids : idList
			}
		});
	});
	$("#noServer").on("click",function(e){
		e.preventDefault();
		$(this).hide();
		$("#retryGetAlerts").show();
	});
	$("#retryGetAlerts").on("click",function(e){
		e.preventDefault();
		$(this).hide();
		socket.getConnected();
	});
	return alertObj;
})();
