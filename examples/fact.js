console.log("Lourah.jsFramework.parentDir()::" + Lourah.jsFramework.parentDir());
let fact = n => (n>1)?n*fact(n-1):1;
let compute = n => {
		var f = fact(n);
		console.log(java.lang.Thread.currentThread().getName() + "::" + n + "!=" + f);
}

var t = [];
for (i = 0; i < 10; i++) {
		var n = i + 1;
		t[i] = new java.lang.Thread((new function() {
				var k;
				this.init = function (p)  {k = p; return this;}
				this.run = () => compute(k);
		}).init(n));
}

for (i = 9; i >= 0; i--) t[i].start();
