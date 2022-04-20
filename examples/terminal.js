Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.ui.ansi.js");
/*
 * Emulate a terminal (input and output)
 */

const PS1 = (new Lourah.ui.ansi.style.Style( [ Lourah.ui.ansi.style.bold(true) , Lourah.ui.ansi.style.red(true) , Lourah.ui.ansi.style.italic(true) ])) + "=> " + (new Lourah.ui.ansi.style.Style());
const CTRL_D = 4;
const CTRL_J = 10;
const CTRL_M = 13;

const puts = s => {
	java.lang.System.out.print(s);
	java.lang.System.out.flush();
}

const putc = c => puts(String.fromCharCode.apply(null, c));

var cwd = new java.io.File(java.lang.System.getProperty("user.dir"));


const shell = (command) => {
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

const rawInput = (onOff) => shell("/bin/stty " + (onOff?"raw -echo -iuclc":"sane") + " </dev/tty")

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
			console.log("cwd::" + cwd.getCanonicalPath());
			console.log("tcwd::" + tcwd.getCanonicalPath());
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
			java.lang.System.out.println(Activity.loadScript(command.substring(1), "stdin").s);
		} catch(e) {
			console.log("ERROR::" + e);
		}
		return STATUS_OK;
	}

	shell(command);

	return STATUS_OK;
}


rawInput(true);
puts(PS1);
const tty = java.lang.System.console();
const ttyReader = tty.reader();

var commandBytes = [];
var history = [];

var input = [];
var idx = 0;
var getToken = () => {
	var c;
	if (idx === input.length) {
		c = ttyReader.read();
		idx = input.push(c);
	}
	if (c === ESC) {
		
	}
}

for(;;) {
	var c = ttyReader.read();
	//java.lang.System.out.println("c::" + c + "::" + ((c<32)?c:("'" + String.fromCharCode.apply(null, [c]) + "'\r")));
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
