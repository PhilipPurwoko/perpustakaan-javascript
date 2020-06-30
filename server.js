import { createServer } from 'http';
const port = 8080;

createServer(
	function(req,res){
		res.write('Node.js');
		res.end()
	}
).listen(port);
console.log(`Server running at port ${port}...`)
console.log(`http://localhost:${port}`)