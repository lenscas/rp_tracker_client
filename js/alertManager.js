alertManager = {
	holder : $("#alert-holder"),
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
	removeAllAlerts : function(){this.holder.empty()},
}
