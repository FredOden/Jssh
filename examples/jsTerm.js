var System = java.lang.System
var env = new java.lang.String(Lourah.jsFramework.args()[1]);
var val = System.getenv(env);

console.log(env + "::'" + val + "'");

try {
	System.out.print(val);
} catch(e) {
	console.log("Error::" + e);
}

