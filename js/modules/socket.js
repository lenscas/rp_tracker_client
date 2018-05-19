socket = (function(){
	
	//this is used to handle responses
	const callList = {};
	const permEvents = {};
	//a queue that holds messages until we have a connection
	const queue = [];
	const failQueu = [];
	const openQueu = [];
	//is used to see if calls need to go to the queue or can be send
	let isConnected = false;
	let connGotClosed = false;
	let socket = null;
	//this is used to send a message.
	//it places messages into a queue until we have a connection
	//this is what actually sends a message. DO NOT USE DIRECTLY!
	const _send = (data)=>{
		console.log("??");
		let sendData = {
			data  : data.data,
			route : data.route
		}
		if(data.callBack){
			sendData.replyId = createReturnCode();
			callList[sendData.replyId] = data.callBack;
			delete data.callBack;
		}
		sendData = JSON.stringify(sendData);
		console.log(sendData);
		socket.send(sendData);
	};
	const createReturnCode = ()=>{
		let id = "";
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let duplicate = false;
		do{
			for (let i = 0; i < 5; i++){
				id += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			duplicate = callList[id];
		}while(duplicate)
		return id;
	};
	//used to connect to a websocket.
	//Also goes through the queue to send everything when we got a connection
	//it also adds an event that listens to incoming messages
	const connect = config => {
		isConnected = false;
		connGotClosed = false;
		socket = null;
		socket = new WebSocket(config.url+":"+config.port);
		socket.addEventListener(
			"open",
			event => {
				console.log(socket);
				_send({
					route    : ["users","register"],
					data     : {registerCode : config.registerCode},
					callBack : (data)=>{
						console.log("in callback");
						console.log(data);
						isConnected = true;
						openQueu.forEach((value)=>value());
						queue.forEach((value)=>_send(value));
						//this empties the queue
						queue.length = 0;
					}
				})
			}
		);
		socket.addEventListener(
			"error",
			event => {
				connGotClosed = true;
				failQueu.forEach(fun=>fun());
			}
		);
		socket.addEventListener(
			"close",
			event => {
				connGotClosed = true;
				failQueu.forEach(fun=>fun());
			}
		);
		socket.addEventListener('message', (event)=>{
			const data = JSON.parse(event.data);
			if(data.replyId && callList[data.replyId]){
				callList[data.replyId](data);
				delete callList[data.replyId];
			} else if(data.route) {
				if(permEvents[data.route]){
					permEvents[data.route](data);
				} else {
					console.error(
						"Got event call but no event handler yet for " + data.route
					);
				}
			} else {
				console.error("something went wrong!");
				console.log(data);
			}
		});
	};
	return {
		getConnected : function(){
			api.get({
				url : "socket/config",
				callBack : function(xhr,status){
					if(status!=="success"){
						return;
					}
					connect(xhr.responseJSON.data);
				}
			});
		},
		send : function(data){
			if(isConnected){
				_send(data);
			} else {
				queue.push(data);
			}
		},
		registerEvent : function(url,callBack){
			if(!permEvents[url]){
				permEvents[url] = callBack
				return true;
			} else {
				return false;
			}
		},
		removeEvent : function(url){
			delete permEvents[url];
		},
		registerOnFail(callBack){
			if(connGotClosed){
				callBack();
			}
			failQueu.push(callBack);
		},
		registerOnOpen(callBack){
			console.log(callBack);
			if(socket){
				callBack();
			}
			openQueu.push(callBack);
		}
	}
})()
socket.getConnected()
