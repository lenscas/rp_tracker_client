console.log("it loaded")
pageHandler.registerPageCode({
	bindEvents : function(){
		console.log("it should be binded");
		$("#awesome").on("click",function(){
			alert("it worked!");
		});
	}
});
