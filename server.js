var http = require('http');
var url  = require('url');
const PORT = process.env.PORT || 5000


function start(route){	
	var onRequest = function(request,response){
		route(request,response);		
	};
	console.log(PORT);
	http.createServer(onRequest).listen(PORT);
	console.log("Server has started");
}

exports.start= start;