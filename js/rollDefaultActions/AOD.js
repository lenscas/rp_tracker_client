battleSystems.register("AOD",
{
	calcStats : char =>{
		return {
			HP  : char.HP.both,
			ACC : char.ACC.both,
			EVA : char.EVA.both,
			ATK : char.ATK.both,
			DEF : char.DEF.both,
			SPD : char.SPD.both,
			SZE : char.SZE.both,
			RAN : char.RAN.both,
		}
	},
	roll1 : function(){ return Math.floor(Math.random() *10)},
	rollX : function(amount){
		let total = 0;
		for(i=0;i<amount;i++){
			total = total +this.roll1();
		}
		return total;
	},
	calcRawDamageToMod : function(mods,amount,options){
		options = options || {};
		return {
			name :  options.names || "Damage",
			value : amount,
			countDown : -1,
			intName   : "HP"
		};
	},
	makeBasicResSTR : (name,roll) => "The "+name+" rolled <b>"+roll+"</b>.<br>",
	actions : {
		check : function(attacker,defender,singleRes){
			singleRes = singleRes || false;
			const atk = battleSystems.loaded.AOD.calcStats(attacker);
			const def = battleSystems.loaded.AOD.calcStats(defender);
			const rollAtk = battleSystems.loaded.AOD.rollX(atk.ACC);
			const rollDef = battleSystems.loaded.AOD.rollX(def.EVA);
			const outcome = rollAtk>rollDef;
			const returnData = {
				attacker : battleSystems.loaded.AOD.makeBasicResSTR("attacker",rollAtk),
				defender : battleSystems.loaded.AOD.makeBasicResSTR("defender",rollDef),
				outcome : {
					str : outcome ? "The attacker landed!" : "the attack missed!",
					outcome : outcome
				}
			};
			return singleRes ? returnData : [returnData];
		},
		attack : function(attacker,defender){
			console.log(attacker);
			console.log(defender);
			const result = this.check(attacker,defender,true);
			const returnData = [result];
			if(!result.outcome.outcome){
				return returnData;
			}
			const atk = battleSystems.loaded.AOD.calcStats(attacker);
			const def = battleSystems.loaded.AOD.calcStats(defender);
			const rollAtk = battleSystems.loaded.AOD.rollX(atk.ATK);
			const rollDef = battleSystems.loaded.AOD.rollX(def.DEF);
			//calc damage here!
			const damage = 1;
			
			returnData.push({
				attacker : battleSystems.loaded.AOD.makeBasicResSTR("attacker",rollAtk),
				defender : battleSystems.loaded.AOD.makeBasicResSTR("defender",rollDef),
				outcome  : {
					str : "The attacker did <b>"+damage+"</b> damage!",
					damage : damage
				}
			})
			console.log
			return returnData;
		}
	}
}
)

