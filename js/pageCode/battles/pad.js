codeHandler.registerPageCode({
	dependencies : ["socket","battleManagerModule","basicFunctions"],
	once : function(){
		const pad = $("#battlePad");
		this.managePanel = htmlGen.createPanel(
			pad,
			{
				color : "danger",
				title : "manage",
			}
		);
		this.messageContainer = $('<div></div>');
		this.textBoxContainer = $('<form></form>')
		this.textBox = $('<textarea style="width:100%"></textarea>');
		this.characterSelect = $('<select></select>');
		this.createButton = $('<button class="btn btn-success pull-right">Send</button>');
		this.textBoxContainer.append(this.textBox).append(this.characterSelect).append(this.createButton);
		this.writePanel = htmlGen.createPanel(
			pad,
			{
				color : "primary",
				title : "pad",
				text  : $('<div></div>').append(this.messageContainer).append(this.textBoxContainer)
			}
		);
		this.gridPanel = htmlGen.createPanel(
			pad,
			{
				color : "info",
				title : "grid",
				text  : "<h4>WIP</h4>"
			}
		); 
	},
	startUp : function(params){
		this.managePanel.hide();
		this.rpCode   = params[0];
		this.battleId = params[1];
		let count =0;
		const further = ()=>{
			count++;
			if(count==2){
				if(this.config.isGM==="1"){
					this.fillManager();
				}
			}
		}
		api.get({
			url : "rp/"+this.rpCode+"/config",
			callBack : (xhr,status)=>{
				if(status!=="success"){
					return;
				}
				this.config = xhr.responseJSON.data;
				further();
			}
		})
		api.get({
			url : "rp/"+this.rpCode+"/battles/"+this.battleId,
			callBack : (xhr,status)=>{
				if(status!=="success"){
					return;
				}
				const data = xhr.responseJSON.data;
				this.characters=data.characters;
				this.characters.forEach(value=>
					this.characterSelect.append(
						$('<option></option>')
							.append(value.name)
							.val(value.code)
					)
				);
				this.battle = data.battle;
				this.modifiers = data.modifiers;
				further();
			}
		})
		this.getPadAndFill();
		
	},
	fillPad : function(data){
		const messageContainer = this.messageContainer.empty();
		data.messages.forEach(message => {
			$('<div class="row"></div>')
				.append(
					$('<div></div>')
						.addClass("col-md-12")
						.append(
							$('<span></span>')
								.append(message.text.replace(/\n/g,"<br>"))
								.css("background-color",message.backgroundColor)
								.css("color",message.textColor)
						)
				)
				.appendTo(messageContainer);
		});
	},
	getPadAndFill : function(){
		socket.send({
			route : ["pad","getPad"],
			data  : {
				battleId : this.battleId,
				rpCode   : this.rpCode
			},
			callBack : data => {
				this.fillPad(data);
			}
		});
	},
	fillManager : function(){
		this.managePanel.show();
		this.battleManager = new BattleManagerHelper({
			characterContainer : this.managePanel.find(".panel-body").empty(),
			config             : this.config,
			rpCode             : this.rpCode,
			characters         : this.characters,
			modifiers          : this.modifiers,
		});
	},
	bindEvents : function(){
		const that = this;
		$(this.textBoxContainer).on("submit",function(event){
			event.preventDefault();
			const text = that.textBox.val();
			const sendData = {
				message  : text,
				rpCode   : that.rpCode,
				battleId : that.battleId,
				charCode : that.characterSelect.val()
			};
			socket.send({
				route : ["pad","addMessage"],
				data  : sendData,
				callBack : data =>{
					if(data.success){
						that.getPadAndFill();
						that.textBox.empty().val("");
					}
				}
			});
		});
		socket.registerEvent(
			"newMessage/"+this.rpCode+"/"+this.battleId,
			data =>this.getPadAndFill()
		);
	}
})
