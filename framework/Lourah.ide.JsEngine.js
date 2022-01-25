var Lourah = Lourah || {};
(function () {
Lourah.ide = Lourah.ide || {};
if (Lourah.ide.JsEngine) return;

Lourah.ide.JsEngine = function() {
	var cx = org.mozilla.javascript.Context.enter();
	var errorReporter = undefined;
	var script = "unknown";
	
	cx.setOptimizationLevel(-1);
	scope = cx.initStandardObjects();
	
	this.addProperty = (property, value) => {
		org.mozilla.javascript.ScriptableObject.putProperty(scope, property, value);
		};
	
	this.setErrorReporter = (er) => {
		errorReporter = er;
		cx.setErrorReporter(errorReporter);
		};
	
	this.setScript = (s) => {
		script = s;
		}
		
	this.finalize = () => {
		org.mozilla.javascript.Context.exit();
		}
	
	this.eval = (jss) => {
		try {
			  var o = {};
			  o.o = cx.evaluateString(scope, jss, script, 1, null);
			  o.s = org.mozilla.javascript.Context.toString();
			  return o;
			} catch(e) {
				throw "Lourah::ide:JsEngine::eval::" + e;
			}
		};

	this.evalFile = (jsFile) => {
		try {
			  var o = {};
			  o.o = cx.evaluateReader(scope, new java.io.FileReader(jsFile), script, 1, null);
			  o.s = org.mozilla.javascript.Context.toString();
			  return o;
			} catch(e) {
				throw "Lourah::ide:JsEngine::eval::" + e;
			}
		};
	};
})();
