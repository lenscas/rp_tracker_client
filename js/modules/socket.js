socket = {
	//this is used to handle responses
	callList : {},
	permEvents : {},
	//a queue that holds messages until we have a connection
	queue : [],
	//is used to see if calls need to go to the gueue or can be send
	isConnected : false,
	//this is used to send a message.
	//it places messages into a queue until we have a connection
	send : function(data){
		if(this.isConnected){
			this._send(data);
		} else {
			this.queue.push(data);
		}
	},
	createReturnCode : function() {
		let id = "";
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let duplicate = false;
		do{
			for (let i = 0; i < 5; i++){
				id += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			duplicate = this.callList[id];
		}while(duplicate)
		return id;
	},
	//this is what actually sends a message. DO NOT USE DIRECTLY!
	_send : function(data){
		let sendData = {
			data  : data.data,
			route : data.route
		}
		if(data.callBack){
			sendData.replyId = this.createReturnCode();
			this.callList[sendData.replyId] = data.callBack;
			delete data.callBack;
		}
		sendData = JSON.stringify(sendData);
		this.socket.send(sendData);
	},
	registerEvent : function(url,callBack){
		if(!this.permEvents[url]){
			this.permEvents[url] = callBack
			return true;
		} else {
			return false;
		}
	},
	removeEvent : function(url){
		delete this.permEvents[url];
	},
	//used to connect to a websocket.
	//Also goes through the queue to send everything when we got a connection
	//it also adds an event that listens to incoming messages
	connect : function(config) {
		this.socket = new WebSocket(config.url+":"+config.port);
		this.socket.addEventListener(
			"open",
			event=>{
				this._send({
					route    : ["users","register"],
					data     : {registerCode : config.registerCode},
					callBack : (data)=>{
						console.log("in callback");
						console.log(data);
						this.isConnected = true;
						this.queue.forEach((value)=>this._send(value));
						this.queue = null;
					}
				})
			}
		);
		this.socket.addEventListener('message', (event)=>{
			const data = JSON.parse(event.data);
			if(data.replyId && this.callList[data.replyId]){
				console.log("do callback");
				console.log(this.callList);
				this.callList[data.replyId](data);
				delete this.callList[data.replyId];
				console.log(this.callList);
			} else if(data.route) {
				console.log(data);
				if(this.permEvents[data.route]){
					this.permEvents[data.route](data);
				} else {
					console.log(
						"Got event call but no event handler yet for " + data.route
					);
				}
			} else {
				console.log("something went wrong!");
				console.log(data);
			}
		});
	}
}
api.get({
	url : "socket/config",
	callBack : function(xhr,status){
		if(status!=="success"){
			return;
		}
		socket.connect(xhr.responseJSON.data);
	}
})
