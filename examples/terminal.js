/*
* Emulate a terminal (input and output)
*/
const PS1 = "=> ";
const CTRL_D = 4;
const CTRL_J = 10;
const CTRL_M = 13;

var puts = s => {
		java.lang.System.out.print(s);
		java.lang.System.out.flush();
}

var putc = c => puts(String.fromCharCode.apply(null, c));


var shell = (command) => {
		var p = java.lang.Runtime.getRuntime().exec(
		[ "/bin/sh"
		,"-c"
		, command
		])
		var getStream = inputStream => {
				var br = new java.io.BufferedReader(new java.io.InputStreamReader(inputStream));
				var s = null;
				while ((s = br.readLine()) !== null) {
						puts(s);
						putc([CTRL_J]);
				}
		}
		var tStdin, tStderr;
		(tStdin = new java.lang.Thread({run:() => getStream(p.getInputStream())})).start();
		(tStderr = new java.lang.Thread({run:() => getStream(p.getErrorStream())})).start();
		var r = p.waitFor();
		tStdin.join();
		tStderr.join();
		return r;
}

var rawInput = (onOff) => shell("/bin/stty " + (onOff?"raw -echo":"sane") + " </dev/tty")

rawInput(true);
puts(PS1);
var tty = java.lang.System.console();
var ttyReader = tty.reader();

var commandBytes = [];
var history = [];

for(;;) {
var c = ttyReader.read();
		if (c === CTRL_D) break;

		if (c === CTRL_J || c === CTRL_M) {
				let command = String.fromCharCode.apply(null, commandBytes);
				history.push(command);
				putc([CTRL_M, CTRL_J]);
				rawInput(false);
				shell(command);
				rawInput(true);
				commandBytes = [];
				puts(PS1);
				continue;
		}

		commandBytes.push(c);
		putc([c]);
}


rawInput(false);
