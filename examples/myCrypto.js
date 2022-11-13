Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.blockchain.Block.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.blockchain.Blockchain.js");

var difficulty = Lourah.jsFramework.args()[1] || 3;

console.log("difficulty::" + difficulty);

var theChain = new Lourah.blockchain.Blockchain(difficulty);

theChain.append("abc");

console.log("theChain::<" + theChain + ">");
