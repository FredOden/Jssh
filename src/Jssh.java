/**
 * JsFramework: Make Android scriptable with javascript
 *
 * @author fred.oden@gmail.com
 */


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * The encapsulating Android activity for the possibles javascript applications
 * Each js application is located in a subdirectory of ${EXTERNAL_STORAGE}/LourahJsFramework
 * The name of the subdirectory is the name of the application which should contain, at least,
 * a valid javacript script in a file called "index.js"
 * The call of index.js interpretation is encapsulated by the javascript script starter.js located
 * in the assets Lourah/JsFramework directory.
 * starter.js : construct a specific environment for the javascript application in a unic object
 *              called Lourah.
 *              This object Lourah can be succesivelly be enriched with some javascript
 *              "library" or "modules"
 *              Lourah belongs to the javascript world...
 */
public class Jssh
    implements JsActivity {

  private Js js;


  /**
   * To make possible to develop specific errorReporter from javascript.
   */
  public interface ErrorReporter {
     void report(String m);
  }

  /**
   * TO BE OPTIMIZED
   */
  public void log(String s) {
    System.out.println(s);
  }
  
  private Jssh self = this;

  /**
   * This default reporter is based on Toast and Log
   * Toast is an issue and sould be replaced with a more convenient
   * way to notify error(s) to the user.
   */
  public ErrorReporter errorReporter = new ErrorReporter() {
    public void report(String m) {
	System.err.println(m);
    }
  };

  /**
   * As notification appears on the user interface, the report is always
   * executed in the UI Thread of android. (As javascript application can be
   * multithreaded).
   * @param error  message
   */
  public void reportError(String error) {
        errorReporter.report("reportError::" + error);
  }

  /**
   * Not yet implemented
   * @param warning
   */
  public void reportWarning(String warning) {
    
  }


  static boolean first = true;

  public static void main (String[] args){
    System.out.println("jssh::started::" + args[0]);
    new Jssh(args[0]);
   }
  /**
   * Create this activity
   * @param savedInstanceState
   */
  public Jssh(String script) {
    js = new Js(this);
    System.out.println(importScript(script).s);
  }

  //public static Charset encoding = StandardCharsets.UTF_8;
  public static File root = null;

  /**
   * Common method to load a source code (utf-8) from an InputStream
   * @param is to read
   * @return full source code content
   */
  public String inputStream2String(InputStream is) {
    StringBuffer sb = new StringBuffer();
    try {
       BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
       int c = 0;
       while((c = br.read()) != -1) {
         sb.append((char)c);
       }
       br.close();
       
    } catch (Exception ioe) {
     reportError("inputStream2string::" + ioe);
    } 
    return sb.toString();
  }

  /**
   * read source code from asset file
   * @param asset filename
   * @return full source code content
   */
/*
  public String asset2String(String asset) {
    String ret = "";
    try {
     ret = inputStream2String(getAssets().open(asset));
     } catch(IOException ioe) {
       reportError("asset2String::" +ioe);
     }
     return ret;
  }
*/

  /**
   * read source code from external storage file
   * @param path  of the file
   * @return full source code content
   */
  public String path2String(String path) {
    try {
      File f = new File(path);
      return inputStream2String(new FileInputStream(f));
    } catch (IOException ioe) {
      return ioe.getMessage();
    }
  }

  public Js getJs() {
    return js;
  }


  /**
   * Called from javascript for modular purpose
   * @param scriptName
   * @return execution status or value
   */
  public Js.JsObject importScript(String scriptName) {
    Js.JsObject o;
    o = js.eval(path2String(scriptName), scriptName);
    if (!o.ok) {
      reportError("importScript::" + o.s);
    }
    return o;
  }

  // SHOULD BE DEPRECATED
  public void onBackPressed() {
    String script = "Lourah.jsFramework.onBackPressed();";
    Js.JsObject o =
           js.eval(script, "JsFramework.java");
           if(!o.ok) {
                reportError("LourahJsFramework::onBackPressed::"
                    + o.s
                   );
                return;
           }
    if (o.s.equals("false")) {
      //super.onBackPressed();
    }
  }

  /**
   * To redirect Activity events to javascript
   * @param onEvent (name of Android activity event) @see Lourah/JsFramework/starter.js
   */
  protected void androidHandler(String onEvent) {
    String script = "(function() {try {var handler = (Lourah !== undefined)?Lourah.jsFramework.getAndroidOnHandler('" + onEvent + "'):undefined;"
           + "if (handler !== undefined) { handler(); }} catch(e){}})()";
    Js.JsObject o =
           js.eval(script, "JsFramework.java");
           if(!o.ok) {
                reportError("LourahJsFramework::androidHandler::"
                    + onEvent + "::"
                    + o.s
                   );
                return;
           }
  }

  /**
   * for display purpose
   * @param e exception error
   * @return
   */
  private String stringifyStackTrace(Exception e) {
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    e.printStackTrace(pw);
    return "{" + sw.toString() + "}";
  }

  /*
       PERMISSIONS HANDLING BELOW ... TO MAKE IT CLEAN
   */

}
