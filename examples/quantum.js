/*
 * try to find wether 1+2+3+......+n tends to -/12
 * and why this limit is used for quantum physics
 */


const FROM = Lourah.jsFramework.args()[1];
const TO = Lourah.jsFramework.args()[2];
function Sigma(u,from, to) {
	sigma = 0;
	for(i = from; i <= to; i++) {
		var y = u(i);
		sigma += y;
	}
	console.log("SIGMA::" + sigma);
}


const delta = i =>  (Math.random() - .5)/1000;

const u1 = i => delta(i) + ((i%2)?1:-1);

Sigma(u1, FROM, TO);
