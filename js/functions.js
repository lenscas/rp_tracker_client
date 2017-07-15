const PAGE_HOLDER = "#pageHolder"
function enablePage(route){
	console.log(route)
	const el = $("#"+route[1])
	hideAllPages()
	if(el.length===0){
		
		console.log(conf.pages+route[0]+".html")
		$('<div id="'+ route[1] +'"></div>').appendTo(PAGE_HOLDER).load(
			conf.pages+route[0]+".html",
			function(responce,status,xhr){
				if(status==="error"){
					alert("there was an error!")
					console.log(responce)
					console.log(status)
					console.log(xhr)
				}
			}
		)
	} else {
		renderPage(route[1])
	}
	
}
function hideAllPages(){
	$(PAGE_HOLDER).find("div").hide()
}
function renderPage(id){
	hideAllPages()
	$("#"+id).show()
}
