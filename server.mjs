import { createServer } from 'http';
import { parse } from 'url';
import { readFile,realpathSync } from 'fs';

var server = createServer(
	// request and response
	function(request,response){
		let path = parse(request.url).pathname;
		// Serving html page
		switch (path) {
			case '/':
				response.writeHead(200,{
					'Content-Type':'text/plain'
				});
				response.write('Root Page');
				response.end();
				break;
			case '/home.html':
				readFile(realpathSync('./pages') + path,function(error,data){
					if (error){
						response.writeHead(404);
						response.write(error);
						response.end();
					} else{
						response.writeHead(200,{
							'Content-Type':'text/html'
						});
						response.write(data);
						response.end();
					};
				});
				break;
			default:
				response.writeHead(404);
				response.write('Sorry, Page Not Found');
				response.end();
				break;
		}
	}
);

const port = 8080;
server.listen(port);
console.log(`Server running at port ${port}...`)
console.log(`http://localhost:${port}`)