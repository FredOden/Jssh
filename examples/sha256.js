Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.crypto.Sha256.js");

pattern = Lourah.jsFramework.args()[1] || "zztop";

console.log("hash::" + pattern + "::<" + Lourah.crypto.Sha256.hash(pattern) + ">");
