var Lourah = Lourah || {};

(function () {
	Lourah.ui = Lourah.ui || {};
	if (Lourah.ui.ansi) return;

	const ESC = '\x1B';
	const CSI = ESC + '[';
	const SEP = ';';

	Lourah.ui.ansi = {
		cursor: {
			home: () => CSI + 'H'
			,to: (x, y) => CSI + x + SEP + y + 'H'
			,up: (y) => CSI + y + 'A'
			,down: (y) => CSI + y + 'B'
			,right: (x) => CSI + y + 'C'
			,left: (x) => CSI + y + 'D'
			,lineUp: (y) => CSI + y + 'F'
			,lineDown: (y) => CSI + y + 'E'
			,column: (x) => CSI + x + 'G'
			,request: () => CSI + '6n'
			,scrollUp: () => ESC + 'M'
			,save: () => ESC + '7'
			,restore: () => ESC + '7'
		}
		, erase: {
			toEndOfScreen: () => CSI + '0J'
			,toBeginningOfScreen: () => CSI + '1J'
			,screen: () => CSI + '2J'
			,savedLines: () => CSI + '3J'        // What is it ???
			,toEndOfLine: () => CSI + '0K'
			,toBeginningOfLine: () => CSI + '1K'
			,line: () => CSI + '2K'
		}
		, style: {
			/*
			 * To set styles, use class Lourah.ui.ansi.style.Style:
			 *    style = new Lourah.ui.ansi.style.Styles();
			 *    // At this level, style is initialized as reset()
			 *    // which is the default style.
			 *    // Then manage style.attributes array by filling with styles
			 *    style.attributes = [ Lourah.ui.ansi.style.bold(true), Lourah.ui.ansi.style.blue(true) ];
			 *    style.attributes.push(Lourah.ui.ansi.style.magenta(false) ];
			 *    // etc ...
			 *    // note that for color: foreground is true and background is false
			 *    // can use Lourah.ui.ansi.style.FOREGROUND or BACKGROUND
			 */
			start: () => CSI
			,end: () => 'm'
			,reset: () => '0'
			,bold: (b) => b?'1':'22'
			,dimmed: (b) => b?'2':'22'
			,italic: (b) => b?'3':'23'
			,underline: (b) => b?'4':'24'
			,blink: (b) => b?'5':'25'
			,reverse: (b) => b?'7':'27'
			,hidden: (b) => b?'8':'28'
			,strikethrough: (b) => b?'9':'29'
			,black: (foreground) => foreground?'30':'40'
			,red: (foreground) => foreground?'31':'41'
			,green: (foreground) => foreground?'32':'42'
			,yellow: (foreground) => foreground?'33':'43'
			,blue: (foreground) => foreground?'34':'44'
			,magenta: (foreground) => foreground?'35':'45'
			,cyan: (foreground) => foreground?'36':'46'
			,white: (foreground) => foreground?'37':'47'
			,default: (foreground) => foreground?'39':'49'
			,reset: () => '0'
			,FOREGROUND: true
			,BACKGROUND: false
			,Style: function () {
				this.attributes = [Lourah.ui.ansi.style.reset()];
				this.toString = () => Lourah.ui.ansi.style.start() + this.attributes.join(SEP) + Lourah.ui.ansi.style.end();
			}
		}
		, screen: {

		}
	}

})();

var style = Lourah.ui.ansi.style;

var boldBlue = new style.Style();
boldBlue.attributes = [style.bold(true), style.italic(true), style.blue(true), style.strikethrough(true)];
var reset = new style.Style();
console.log("::" + boldBlue + "Bold&Blue" + reset + "::");
