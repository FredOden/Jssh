Lourah.count = Lourah.count || 0;
Lourah.count++;
var s = "<ul>";
for(var i = 0; i < 10; i++) {
		s += "<li>" + i + "</li>";
}
s += "</ul>";
s += Lourah.count;
