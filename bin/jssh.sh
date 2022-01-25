#/bin/sh
export JSSH_DIR=/home/pi/Lourah/JSF/jssh
export JSSH_BIN=$JSSH_DIR/bin
export JSSH_LIBS=$JSSH_DIR/libs
export JSSH_FRAMEWORK_DIR=$JSSH_DIR/framework
export JSSH_ASSETS=$JSSH_DIR/assets
export JSSH_STARTER=$JSSH_ASSETS/jssh.js
export JSSH_RHINO=rhino-1.7.13.jar
java -cp $JSSH_LIBS/$JSSH_RHINO:$JSSH_BIN/jssh.jar Jssh $1
