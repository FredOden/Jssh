/**
 * Js : the Javascript engine based on RHINO 1.7.9
 *
 * @author: fred.oden@gmail.com
 */
import java.io.IOException;
import java.text.MessageFormat;
//import java.util.Locale;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

import org.mozilla.javascript.*;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.EvaluatorException;
//import org.mozilla.javascript.ScriptRuntime;

class Js {
    private Context cx;
    private Scriptable scope;
    private JsActivity activity;

    /**
     * JsObject: for the result of a javascript execution
     * ok: true if succeeded or warning(s), false if failed
     * s: result of execution in a java String or error message
     * o: object returned by succeeded execution or exception.
     * js: the interpreter context where the javascript execution was performed
     */
    public class JsObject {
        public boolean ok;
        public String s;
        public Object o;
        public Js js;

        /**
         * create a result object within a javascript interpretation context
         * @param js  Interpretation context
         */
        public JsObject(Js js) {
            this.js = js;
        }
    }

    /**
     * Create a Js javascript interpreter object for one context of Rhino, linked to the specified
     * Android activity
     * @param activity  Android activity where javascript interpreter is used
     */
    public Js(JsActivity activity) {
        // @20201219: Rhino 1.7.13 Makes massage provider as final
        //ScriptRuntime.messageProvider = new AssetMessageProvider();
        // @issue: must use this.activity non statically ...
        this.activity = activity;
        cx = Context.enter();
        cx.setOptimizationLevel(-1);
        // Added for Rhino-1.7.11.jar version
        cx.setLanguageVersion(Context.VERSION_ES6);
        this.activity.log(
                "Rhino version:"
                        + org.mozilla.javascript.Context.getCurrentContext().getImplementationVersion());
        scope = this.cx.initStandardObjects();
        ScriptableObject.putProperty(scope, "Activity", Context.javaToJS(activity, scope));
        ScriptableObject.putProperty(scope, "console", Context.javaToJS(activity, scope));
        //Context.getCurrentContext().setErrorReporter(this);
    }

    /**
     * making sure that Rhino's context is released when Js is no more used
     */
    public void finalize() {
        Context.exit();
    }

    /**
     * Perform javascript evalutation
     * @param s          string containing javascript source code to be executed
     * @param filename   name of file containing the source code
     * @return status of execution @see JsObject
     */
    public JsObject eval(String s, String filename) {
        JsObject obj = new JsObject(this);
        try {
            obj.o = cx.evaluateString(scope, s, filename, 1, null);
            obj.ok = true;
            obj.s = Context.toString(obj.o);
            return obj;
        } catch (Exception e) {
            obj.ok = false;
            obj.s = e.getMessage();
            obj.o = e;
            return obj;
        }

    }

    /**
     * reports error to the enclosing activity (param names are explicits)
     * @param message
     * @param sourceName
     * @param line
     * @param lineSource
     * @param lineOffset
     */
    public void error(String message, String sourceName, int line, String lineSource, int lineOffset) {
        activity.reportError("error::" + message + "::at " + sourceName + "::(" + line + ":" + lineOffset + ")::" + lineSource);
    }

    /**
     * reports warning to the enclosing activity (param names are explicits)
     * @param message
     * @param sourceName
     * @param line
     * @param lineSource
     * @param lineOffset
     */
    public void warning(String message, String sourceName, int line, String lineSource, int lineOffset) {
        activity.reportWarning("warning::" + message + "::at " + sourceName + "::(" + line + ":" + lineOffset + ")::" + lineSource);
    }

    /**
     * reports a FATAL execution error to the enclosing activity  (param names are explicits)
     * @param message
     * @param sourceName
     * @param line
     * @param lineSource
     * @param lineOffset
     * @return
     */
    public EvaluatorException runtimeError(String message, String sourceName, int line, String lineSource, int lineOffset) {
        activity.reportError("runtime error::" + message + "::at " + sourceName + "::(" + line + ":" + lineOffset + ")::" + lineSource);
        return new EvaluatorException(message, sourceName, line, lineSource, lineOffset);
    }

}
