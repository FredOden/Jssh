/*
 *
 * Emulate a terminal (input and output)
 */
(function Terminal () {
	/* Terminal is enclosed in (function() { .... }
	 * so enclosed code is not visible
	 * from loadScript inline javascript
	 */
	Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.ui.ansi.js");
	console.log("Lourah.jsFramework.dir::" + Lourah.jsFramework.dir());
	Activity.importScript("jsshLanguage.js");

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


	/*
	 * shell: execute command
	 *
	 *        for the prototype the command is executed via /bin/sh -c command
	 *        Should study the opportunity to exec the command directly
	 *        using getenv("PATH").split(":")
	 *
	 */
	const shell = (command) => {
		var stdout = ""; stderr = "";
		var p = java.lang.Runtime.getRuntime().exec(
			[ "/bin/sh"
				,"-c"
				, command
			]
			, null
			, cwd
		)
		var getStream = (inputStream, std) => {
			var br = new java.io.BufferedReader(new java.io.InputStreamReader(inputStream));
			var s = null;
			while ((s = br.readLine()) !== null) {
				puts(s);
				putc([CTRL_J]);
				std += s + "\n";
			}
		}
		var tStdin, tStderr;
		(tStdin = new java.lang.Thread({run:() => getStream(p.getInputStream(), stdout)})).start();
		(tStderr = new java.lang.Thread({run:() => getStream(p.getErrorStream(), stderr)})).start();
		var r = p.waitFor();
		tStdin.join();
		tStderr.join();
		return {
			status:r
			,stdout:stdout
			,stderr:stderr
		};
	}

	const rawInput = (onOff) => shell("/bin/stty " + (onOff?"raw -echo -iuclc":"sane") + " </dev/tty")

	const STATUS_OK = 0;
	const STATUS_EXIT = -4;

	function parse(command) {
		if (command === "exit") return STATUS_EXIT;


		if (command === "history") {
			for(var i = 0; i < history.length; i++) {
				java.lang.System.out.println(i + " - " + history[i]);
			}
			return STATUS_OK;
		}

		if (command.charAt(0) === '!') {
			var search = new RegExp("^" + command.substring(1));
			for(var i = history.length - 1; i >= 0; i--) {
				console.log(i + "::" + history[i] + "::" + search);
				if (history[i].match(search)) return parse(history[i]);
			}
			java.lang.System.out.println("Not in history!");
			return -1
		}


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

		var run;
		try {
			var instance = jsshLanguageParser.compile(command);
			run = instance.run();
			vars.set("_", run);
		} catch(e) {
			console.log("parse::" + e);
			run = () => -1;
		}

		if (!run) {
			vars.set("_", shell(command).stdout);
		}

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
			putc([CTRL_M, CTRL_J]);
			rawInput(false);
			let status = parse(command.trim());
			if (status === STATUS_OK) history.push(command.trim());
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
})();
