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

var cwd = new java.io.File(java.lang.System.getProperty("user.dir"));


var shell = (command) => {
	var p = java.lang.Runtime.getRuntime().exec(
		[ "/bin/sh"
			,"-c"
			, command
		]
		, null
		, cwd
	)
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

const STATUS_OK = 0;
const STATUS_EXIT = -4;

function parse(command) {
	if (command === "exit") return STATUS_EXIT;

	if (command.startsWith("cd ") || command === "cd") {
		var cd = command.split(/\s+/);
		try {
			var tcwd;
			if (cd[1]) tcwd=new java.io.File(cwd.getAbsolutePath(), cd[1]);
			else tcwd = new java.io.File(java.lang.System.getenv("HOME"));
			console.log("cwd::" + cwd.getAbsolutePath());
			console.log("tcwd::" + tcwd.getAbsolutePath());
			if (!tcwd.exists() || !tcwd.isDirectory()) throw "cannot change directory to " + tcwd;
			cwd = tcwd;
		} catch(e) {
			console.log("CHDIR::" + e);
		}
		return STATUS_OK;
	}

	if (command === "help") {
		console.log("HELP: prefix javascript instructions with =, otherwise it is a shell command");
		return STATUS_OK;
	}

	if (command.charAt(0) === '=') {
		try {
			java.lang.System.out.println(eval(command.substring(1)));
		} catch(e) {
			console.log("ERROR::" + e);
		}
		return STATUS_OK;
	}

	shell(command);

	return STATUS_OK;
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
		let status = parse(command.trim());
		rawInput(true);
		if (status === STATUS_EXIT) break;
		commandBytes = [];
		puts(PS1);
		continue;
	}

	commandBytes.push(c);
	putc([c]);
}


rawInput(false);
