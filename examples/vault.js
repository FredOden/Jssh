Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.crypto.Sha256.js");

var pattern;

if (!(pattern = Lourah.jsFramework.args()[1])) throw "code required";

let radix = Lourah.crypto.Sha256.hash(pattern);

console.log("pattern::" + pattern + " radix::'" + radix + "'");
