var Lourah = Lourah || {};

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
