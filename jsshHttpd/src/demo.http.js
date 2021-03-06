var JSSH_HTTPD = java.lang.System.getenv("JSSH_HTTPD");
var JSSH = java.lang.System.getenv("JSSH");
var Lourah = Lourah || {};
console.log(JSSH_HTTPD);
Lourah.jsFramework = {
	parentDir: () => JSSH + "/framework",
	dir: () => JSSH_HTTPD + "/src",
	name: () => "demo.http"
};
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.http.Protocol.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.socket.Server.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.http.js2xml.J2X.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.http.js2xml.CSS.js");

(function () {
    Lourah.http = Lourah.http || {};

    if (Lourah.http.Toolkit) return;

    function compress(httpExchange, text) {
      /*
      console.log("compress::length::"
        + text.length
        + "::"
        + text
        );
      */
      if (text.length > Toolkit.MINIMUM_SIZE_TO_COMPRESS) {
        var response = httpExchange.getResponseMessage();
        var request = httpExchange.getRequestMessage();
        var acceptEncoding = request.getHeaders().get("Accept-Encoding");
        console.log("acceptEncoding::" + acceptEncoding);
        if (acceptEncoding && acceptEncoding.indexOf("gzip") > -1) {
          console.log("Encode");
          response.getHeaders().set("Content-Encoding", "gzip");
          }
        }
      }

    var Toolkit = {
      MINIMUM_SIZE_TO_COMPRESS:256
      ,roughHandler: roughHandler
      ,htmlHandler: htmlHandler
      ,js2xmlHandler : js2xmlHandler
      ,internalErrorHandler: internalErrorHandler
      ,htmlEscape: htmlEscape
      };

    function roughHandler(httpExchange, text, contentType, charset, code) {
      code = code || 200;
      //console.log("/test::ex::" + ex);
      var response = httpExchange.getResponseMessage();
      var request = httpExchange.getRequestMessage();
      response.setResponseCode(code);
      compress(httpExchange, text);
      response.getHeaders().set("Content-Type", contentType);
      response.getHeaders().set("Charset", charset?charset:"UTF-8");
      response.setBody(text);
      response.send();
      }

    function htmlHandler(httpExchange, html, code) {
      roughHandler(httpExchange, html, "text/html", "UTF-8", code);
      }

    function js2xmlHandler(httpExchange, js2xml, code) {
      try {
        htmlHandler(
          httpExchange
          , Lourah.http.js2xml.J2X(js2xml)
          , code
          )
        }
      catch(e) {
        console.log("js2xmlHandler::" +e);
        internalErrorHandler(
          httpExchange
          ,"js2xmlHandlerError"
          , e
          , js2xml
          )
        }
      }

    function internalErrorHandler(httpExchange, title, errorMessage, text, css) {
      js2xmlHandler(
        httpExchange
        , {
          html: {
            head: {
              title: Toolkit.htmlEscape(title)
              , style: Lourah.http.js2xml.CSS(
                css?css:
                {h1:
                  {
                    color:"red"
                    ,"text-align":"center"
                    }
                  }
                )
              }
            ,body: {
              h1: Toolkit.htmlEscape(errorMessage)
              ,pre: Toolkit.htmlEscape(text)
              }
            }
          }
        , 500
        );
      }


    function htmlEscape(text) {
      return text
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      }

    Lourah.http.Toolkit = Toolkit;
    })();

var formerLog = console.log;

var socketServer;

var started = false;

function startStop() {
  if (started) {
    started = false;
    socketServer.stop();
    return;
    }
  started = true;

  try {
    function grinder() {
      return {td:[$N(2341), $T("grinder"), $N(76.99)]};
      }


    var globalCss = Lourah.http.js2xml.CSS({
        "*":{
          color: "red"
          }
        ,h1: {
          "text-align": "center"
          ,color: "green"
          }
        ,th: {
          "text-align": "left"
          ,"background-color": "#7f00002f"
          }
        ,"td,th": {
          "text-transform": "capitalize"
          }
        }
      );

    function inlineCss(content, style) {
      return {
        $: content
        ,S: style
        }
      }

    var $N = (content) => (inlineCss(content, {
          "text-align" : "right"
          ,"font-style" : "italic"
          , color: "blue"
          }));

    var $T = (content) => (inlineCss(content, {
          "text-align": "left"
          , "font-style" : "bold"
          , color: "#000099"
          }));



    var protocol = new Lourah.http.Protocol({
        "/test": (ex) => {
          try {
            //console.log("/test::ex::" + ex);
            Lourah.http.Toolkit.js2xmlHandler(
              ex
              ,{
                html: {
                  head: {
                    title: "this is a test"
                    ,style: "" + globalCss
                    }
                  ,body: {
                    _: {
                      title: "titre"
                      ,version: "2.0"
                      }
                    ,$:{
                      a: {
                        _: {href:"stop"}
                        ,$:Lourah.http.Toolkit.htmlEscape("<Stop server>")
                        }

                      ,br: ""
                      ,h1: "chapter1"
                      ,p: ""
                      ,form: {
                        _: {
                          method: "POST"
                          }
                        ,$:{
                          input: [
                            {
                              _:{type:"text" ,name:"firstName" ,value:"1st"}
                              //, $:"first name"
                              ,S:{}
                              }
                            , "last name"
                            , "pseudo"
                            ]
                          ,password: ""
                          }
                        }
                      ,table: {
                        _: {
                          id: 122
                          }
                        ,$:{
                          tr : [
                            {th: ["Id", "Name", "Amount"]}
                            ,{td: [$N(1), $T("hammer"), $N(312.98)]}
                            ,{td: [$N(2), $T("screwdriver"), $N(5.76)]}
                            ,grinder()
                            ]
                          }
                        }
                      ,script: J2X.toString()
                      }
                    }
                  }
                });
            } catch(e) {
            console.log("/test::Handler::" + e + "::" + e.stack);
            }
          }
        ,"/eval/.*": (ex) => {
          console.log("/eval::" + ex.getUri().file)
          try {
            Lourah.http.Toolkit.js2xmlHandler(
              ex
              , {
                html: {
                  head: {
                    title: "Evaluation"
                    ,style: "" + globalCss
                    }
                  ,body: {
                    h1: eval("" + ex.getUri().file.split('/')[2])
                    }
                  }
                }
              );
            } catch(e) {
            console.log("/eval::Handler::" + e + "::" + e.stack);
            Lourah.http.Toolkit.internalErrorHandler(
              ex
              , "internal Error"
              , "/eval::Handler::"
              , "" + e + "::" + e.stack
              )
            }
          }
        ,"/stop": (ex) => {
          try {
            console.log("toStop!");
            var response = ex.getResponseMessage()
            response.setResponseCode(200);
            response.setBody("WILL NOT STOP\n");
            response.send();
            //test.stop();
            } catch(e) {
            console.log("/stop::Handler::" + e + "::" + e.stack);
            }
          }
        }
      );


    /*
    var t = java.util.StringTokenizer("a b c");

    console.log(t.nextToken());
    */
    socketServer = new Lourah.socket.Server(
      8080
      ,protocol
      );
    
    socketServer.start();
    } catch (e) {
    console.log("test::" + e + "::" + e.stack);
    }
  }

//sun.misc.Signal.handle(new sun.misc.Signal("INT"), signal => console.log("interrupted by ctrl+C"));

tHookCtrlC = new java.lang.Thread({
run: () => {
try {
	java.lang.Thread.sleep(200);
	console.log("Shutdown");
	if (started) {
		socketServer.stop();
		console.log("socketServer::stopped");
		started = false;
		} else {
		console.log("socketServer::was not started yet");
		}
} catch(e) {
	console.log("tHookCtrlC::error::" + e);
}
	}
});

java.lang.Runtime.getRuntime().addShutdownHook(tHookCtrlC);

try {
	console.log("httpd::starting...");
	startStop();
	console.log("httpd::started");
	} catch(e) {
	console.log("startstop::error::" + e);
}
