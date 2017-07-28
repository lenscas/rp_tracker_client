//this is used to easily create the alerts.
alertManager = {
	//the place where the alerts should go
	holder : $("#alert-holder"),
	//a function to create a new alert
	show   : function (text,color="danger"){
		this.holder.append(
			$('<div></div>')
				.addClass("alert alert-"+color+" alert-dismissible")
				.append(
					'<button type="button" class="close" data-dismiss="alert" aria-label="Close">&times;</button>'
				)
				.append(text)
		);
	},
	//a function to remove all alerts
	removeAllAlerts : function(){this.holder.empty()},
}
