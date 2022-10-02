Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.utils.pdf.js');
Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.io.js');

var PdfDocument = Lourah.utils.pdf.PdfDocument;
var pDoc = new PdfDocument();
pDoc.addObject(new PdfDocument.Record("Catalog", { "/Type": "/Catalog", "/Pages": "&{Pages}" }));
pDoc.addObject(new PdfDocument.Record( "Pages", {"/Type": "/Pages"
	, "/Kids": "[&{Page}]"
	, "/Count": 1
	, "/MediaBox": "[0 0 595 842]"
}));
pDoc.addObject(new PdfDocument.Record( "Page", {
	"/Type": "/Page"
	,"/Parent": "&{Pages}"
	,"/Resources": "&{Resources}"
	,"/Contents": "&{Content}"
}));
pDoc.addObject(new PdfDocument.Record("Fonts", { 
	"/F1": "&{F1}"
	,"/F2": "&{F2}"
}));
pDoc.addObject(new PdfDocument.Record("Resources", {
	"/Font": "&{Fonts}"
}));
// !!! NEVER FORGET: Subtype WITH t LOWER CASE !!!
pDoc.addObject(new PdfDocument.Record("F1", {
	"/Type": "/Font"
	,"/Subtype": "/Type1"
	,"/BaseFont": "/Times-Roman"
	,"/Encoding": "/WinAnsiEncoding"
}));
pDoc.addObject(new PdfDocument.Record("F2", {
	"/Type": "/Font"
	,"/Subtype": "/Type1"
	,"/BaseFont": "/Courier-BoldOblique"
	,"/Encoding": "/WinAnsiEncoding"
}));
var fontSize = 36;
var [top, bottom] = [
	700 + 48 -6
	,700 -10
];
var middle = (top + bottom)/2
pDoc.addObject(new PdfDocument.Record("Content"
	, { "/Length": "/Length" }
	, new PdfDocument.Stream()
	.add("q")
	.add("2 w")
	.add("60 " + top + " m")
	.add("450 " + top + " l")
	.add("60 " + bottom + " m")
	.add("450 " + bottom + " l")
	.add("S")
	.add("0 0 1 RG")
	.add("48 w")
	.add("451 " + middle + " m")
	.add("600 " + middle + " l")
	.add("S")
	.add("Q")
	.add("BT")
	.add("/F1 " + fontSize +" Tf")
	.add(".75 .75 .75 rg")
	.add(textAt(60, 700, "gjy, Mr FRÉDÉRIC ODEN!"))
	.add("0 -35 Td")
	.add("/F2 28 Tf")
	.add("1 0 0 rg")
	.add("(All the Fran)Tj<e7>Tj(ais!) Tj")
	.add("ET")
	.add("BT")
	.add("0 0 0.5 rg")
	.add("30 60 Td")
	.add("/F2 16 Tf")
	.add("16 TL")
	.add("(the quick brown fox jumps)Tj 1 1 (over the lazy dog)\" 1 1(that's it.)\"")
	.add("1 0 0 RG 30 44 200 32 re S")
	.add("ET")
));

var pdf = pDoc.generate();
Lourah.io.string2Path(pdf, Lourah.jsFramework.dir() + "/pdf.pdf");
console.log("pdf::" + pdf);

function toHexString(str) {
	var h ="<";
	for(var i = 0; i<str.length; i++) {
		h += str.charCodeAt(i).toString(16);
	}
	h += ">";
	return h;
}

function textAt(x, y, text) {
	return "1 0 0 1 " + x + " " + y + " Tm\n" + toHexString(text) + "Tj";
}
