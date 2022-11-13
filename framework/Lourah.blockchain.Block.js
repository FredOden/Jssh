var Lourah = Lourah || {};
//Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.crypto.Sha256.js");
(function () {
	Lourah.blockchain = Lourah.blockchain || {};


	Lourah.blockchain.Block = function(data, previousHash ) {
		this.data = data; // data object
		this.previousHash = previousHash;
		this.timeStamp = (new Date()).getTime();
		this.nonce = 0;

		this.prefix = this.previousHash
			+ this.timeStamp
			+ JSON.stringify(this.data)
		;

		//this.suffix = JSON.stringify(this.data);

		this.hash = this.calculateHash();
	};


	//Calculate new hash based on blocks contents
	var z64 = "0".repeat(64);
	Lourah.blockchain.Block.prototype
		.calculateHash = function() {	
			/*
			var calculatedhash = Lourah.crypto.Sha256.hash( 
				this.prefix
				+ this.nonce 
				// + this.suffix // data serialization
			);
			/**/
			var digest = java.security.MessageDigest.getInstance("SHA-256");
			var text = new java.lang.String(this.prefix + this.nonce);
			var hash = digest.digest(text.getBytes(java.nio.charset.StandardCharsets.UTF_8));
			var bi = new java.math.BigInteger(1, hash);
			//var calculatedhash = java.util.Base64.getEncoder().encodeToString(hash);
			var calculatedhash = new String(java.lang.String.format("%064x", bi));
			//console.log("calculatedhash::"+ this.prefix + "::" +this.nonce +"::<" + calculatedhash + ">");
			return calculatedhash;
		};



	Lourah.blockchain.Block.prototype
		.mineBlock = function(difficulty, startNonce) {
			this.nonce = startNonce || 1;
			if (difficulty === 0) return;
			target = "0".repeat(difficulty);
			while(this.hash.substring( 0, difficulty) !== target) {
				//console.log("<" + target + "><" + this.hash.substring(0, difficulty) + ">");
				this.nonce ++;
				this.hash = this.calculateHash();
				if (this.nonce%100000 === 0) {
					console.log("::" + this.nonce + "..<" + this.hash + ">::" +this.hash.length);
				}
				/**/
			}
		};

	Lourah.blockchain.Block.prototype
		.mineBlockBitcoin = function(difficulty, startNonce, fProgress) {
			this.nonce = startNonce || 1;
			if (difficulty === 0) return;
			target = "0".repeat(difficulty);
			while(this.hash.substring( 0, difficulty) !== target) {
				if (fProgress !== undefined) fProgress(this);
				this.nonce ++;
				this.hash = this.calculateHash(this.calculateHash()
					,{msgFormat : 'hex-bytes'});
			} 
		};


	Lourah.blockchain.Block.prototype
		.toString = function() {
			return "Lourah.blockchain.Block::" + JSON.stringify(this);
		}


	if (typeof module != 'undefined' && module.exports)  
		module.exports = {
			Block: Lourah.blockchain.Block
		};
})();

