console.log("Lourah.jsFramework.parentDir()::" + Lourah.jsFramework.parentDir());
console.log("Lourah.jsFramework.args()::" + JSON.stringify(Lourah.jsFramework.args()));
console.log("Lourah.jsFramework.args().length::" + Lourah.jsFramework.args().length);
let fact = n => (n>1)?n*fact(n-1):1;
let compute = n => {
		var f = fact(n);
		console.log(java.lang.Thread.currentThread().getName() + "::" + n + "!=" + f);
}

var t = [];
var N = Lourah.jsFramework.args()[1];
for (i = 0; i < N; i++) {
		var n = i + 1;
		t[i] = new java.lang.Thread((new function() {
				var k;
				this.init = function (p)  {k = p; return this;}
				this.run = () => compute(k);
		}).init(n));
}

for (i = N - 1; i >= 0; i--) t[i].start();
