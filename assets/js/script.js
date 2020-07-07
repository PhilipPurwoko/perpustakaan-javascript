// Book Stock
class Stock{
	'id'=[];
	'title'=[];
	'author'=[];
	'stock'=[];
	
	keys(){
		return ['id','title','author','stock']
	};
}

var perpus_stock = new Stock()

// Xpath Function
function getElementByXpath(path) {
	return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// Animating Notification
function sendNotification(text){
	let interact = document.querySelector('#interact-container');
	interact.innerHTML = text;
	interact.style = 'margin-left:-10px';
	let timeout = setTimeout(function(){
		interact.style = 'margin-left:-250px';
		clearTimeout(timeout);
	},2000);
};

// Function remove book
function DeleteRow(index){
	document.querySelector('#perpus-table').deleteRow(index);
};

// Function insert book
function InsertRow(id,title,author,stock){
	let table = document.querySelector('#perpus-table');
	let row = table.insertRow(-1);
	let cells = [id,title,author,stock]

	let stock_keys = perpus_stock.keys()
	for (var i = 0; i < cells.length; i++) {
		row.insertCell(i).innerHTML = cells[i];
		perpus_stock[stock_keys[i]].push(cells[i])
	};
	console.log(`Successfully added ${cells[3]} books ${cells[1]} by ${cells[2]}`)
};

// Listener add book
document.querySelector("#add-book").addEventListener("click", function(){
	let rows = document.querySelector("#perpus-table").children.length;
	let id = getElementByXpath(`//*[@id="perpus-table"]/tr[${rows}]/td[1]`).innerHTML;
	let title = document.querySelector('#book-title').value;
	let author = document.querySelector('#book-author').value;
	let stock = document.querySelector('#book-stock').value;
	
	if (parseInt(stock) > 0){
		InsertRow(Number(id)+1,title,author,stock);
		sendNotification(`Added ${stock} books ${title} by ${author}`)
	} else{
		sendNotification('Sorry, stock value must a number');
	};
});

// Listener toogle display book
document.querySelector("#toogle-book").addEventListener("click", function(){
	let status = document.querySelector('#toogle-book');
	let table = document.querySelector('#whole-table');
	let the_row = document.querySelector('#table-row');
	if (table.style.display == ''){
		status.innerHTML = 'Show Book';
		table.style.transition = 500;
		table.style.opacity = 0;
		let timeout = setTimeout(function(){
			table.style.display = 'none';
			the_row.style.padding = '0px';
			clearTimeout(timeout);
		},500);
	} else {
		table.style.transition = 500;
		status.innerHTML = 'Hide Book';
		the_row.style.padding = '30px';
		table.style.display = '';
		table.style.opacity = 1;
	}
});


// Default add book
function DefaultTable(){
	let books = [];
	let topics = ['Python','Javascript','Typescript','HTML','CSS','PHP','Node.js','Django','SQL','Java','C','C++','C#'];
	let titles = ['Tingkat Dasar','Tingkat Menengah','Tingkat Atas'];
	let authors = ['Jack','John','Elizabeth','Maria','Lucas','Hendry','Daniel','Philip','Adam'];

	for (let i = 0; i < topics.length; i++) {
		for (let j = 0; j < titles.length; j++) {
			books.push(topics[i] + ' ' + titles[j]);
		};
	};

	for (let i = 0; i < books.length; i++) {
		let author = authors[Math.floor(Math.random() * authors.length)];
		let num = Math.floor(Math.random() * 100) + 1;
		InsertRow(i,books[i],author,num);
	};
};
window.onload = DefaultTable();

// Logic
class Perpustakaan{
	lihat_daftar(){
		console.log('Daftar Buku :');
		console.log(perpus_stock.title);
		return this
	};
	cari(cari,daftar){
		let res = false;
		daftar.forEach(function(a){
			console.log(`Membandingkan ${cari} dengan ${a}`);
			if (cari == a) {
				console.log('Buku ',cari,' ditemukan');
				res = true;
			};
		});	
		if (res==true){
			sendNotification(`${cari} found`)
		} else{
			sendNotification(`Sorry, cant find ${cari}`)
		}
		if (res){
			return [true,cari];
		} else {
			return [false];
		}
	};
};
class Akun extends Perpustakaan{
	pinjaman = [[],[]];
	pinjam(buku){
		let data = this.cari(buku,perpus_stock.title);
		console.log(data)
		if (data[0]){
			let index = perpus_stock.title.indexOf(data[1]);
			this.pinjaman[0].push(data[1]);
			this.pinjaman[1].push(index+1);
			// DeleteRow(perpus_stock.title.indexOf(data[1]));
			let a = Number(getElementByXpath(`//*[@id="perpus-table"]/tr[${index+1}]/td[4]`).innerHTML);
			getElementByXpath(`//*[@id="perpus-table"]/tr[${index+1}]/td[4]`).innerHTML = a-1;
			console.log('Berhasil meminjam ',data[1]);

			sendNotification(`Berhasil meminjam ${data[1]}`);

			// Pinjaman div
			let pinjaman = document.querySelector('#pinjaman');
			let node = document.createElement('div');
			let textnode = document.createTextNode(data[1]);
			node.classList.add('box');
			node.appendChild(textnode);
			pinjaman.appendChild(node);

			document.getElementById('pinjaman').style.transition = 'all 0.5s';
			pinjaman.childNodes[pinjaman.childElementCount-1].style.opacity = 0;
			let timeout = setTimeout(function(){
				pinjaman.childNodes[pinjaman.childElementCount-1].style.opacity = 1;
				clearTimeout(timeout);
			},0);
			this.cek_pinjaman();
			return this
		} else if (data[0] == false){
			console.log('Maaf,',buku,' tidak ditemukan')
			return this
		}
	};
	cek_pinjaman(){
		console.log('Pinjaman : ')
		console.log(this.pinjaman[0])
		return this
	};
	kembalikan_buku(buku){
		let data = this.cari(buku,this.pinjaman[0]);
		if (data[0]){

			// Find index
			let table_rows = document.querySelector('#perpus-table').children;
			let index;
			for (let i = 0; i < table_rows.length; i++) {
				let row_cols = table_rows[i].children;
				let count = Number(row_cols[3].innerHTML);
				// console.log(row_cols[1].innerHTML,buku,count,typeof(count));
				if (row_cols[1].innerHTML == buku){
					index = i+1;
					// console.log(index)
					break
				};
			};

			// console.log(getElementByXpath(`//*[@id="perpus-table"]/tr[${index}]/td[4]`))
			// let value_now = getElementByXpath(`//*[@id="perpus-table"]/tr[${index}]/td[4]`).innerHTML;
			getElementByXpath(`//*[@id="perpus-table"]/tr[${index}]/td[4]`).innerHTML = Number(getElementByXpath(`//*[@id="perpus-table"]/tr[${index}]/td[4]`).innerHTML) + 1;
			this.pinjaman[0].splice(data[1],1);
			this.pinjaman[1].splice(this.pinjaman[0].indexOf(data[1]));
			console.log('Berhasil mengembalikan ',data[1]);
			sendNotification(`Berhasil mengembalikan ${data[1]}`);

			// Update pinjaman div
			let pinjaman = document.querySelector('#pinjaman')
			let pinjaman_list = pinjaman.children
			for (let i = 0; i < pinjaman_list.length; i++) {
				console.log(`Membandingkan ${pinjaman_list[i].innerHTML} dengan ${data[1]}`);
				if (pinjaman_list[i].innerHTML == data[1]){
					pinjaman.childNodes[i].style.opacity = 0;
					let timeout = setTimeout(function(){
						pinjaman.removeChild(pinjaman.childNodes[i]);
						clearTimeout(timeout);
					},500);
					break
				}
			}
			this.cek_pinjaman();
			return this
		} else if (data[0] == false){
			console.log('Anda tidak meminjam buku ',buku);
			sendNotification(`Anda tidak meminjam buku ${buku}`);
			this.cek_pinjaman();
			return this;
		};
	};
};

let user = new Akun();

// Cari buku listenner
const cari_button = document.querySelector('#cari-buku')
cari_button.addEventListener('click',function(){
	let message = document.querySelector('#cari-buku-input').value
	console.log(`Mencari ${message}`)
	result = user.cari(message,perpus_stock.title)
});

// Pinjam buku listener
const pinjam_button = document.querySelector("#pinjam-buku")
pinjam_button.addEventListener('click',function(){
	let message = document.querySelector('#pinjam-buku-input').value
	console.log(`Meminjam ${message}`)
	result = user.pinjam(message)
})

// Kembalikan buku listenner
const kembalikan_button = document.querySelector('#kembalikan-buku')
kembalikan_button.addEventListener('click',function(){
	let message = document.querySelector('#kembalikan-buku-input').value
	console.log(`Mengembalikan buku ${message}`)
	result = user.kembalikan_buku(message)
})

// user.lihat_daftar().pinjam('Javascript Expert').lihat_daftar().cek_pinjaman();