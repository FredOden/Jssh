#/bin/sh -v
$JSSH_JAVAC -Xlint:deprecation -d ../gen -cp ../libs/rhino-1.7.13.jar JsActivity.java Js.java Jssh.java && (
cd ../gen
$JSSH_JAR -cvmf ../src/MANIFEST.MF ../bin/jssh.jar *.class
)
