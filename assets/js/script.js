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
	let id = document.querySelector('#book-id').value;
	let title = document.querySelector('#book-title').value;
	let author = document.querySelector('#book-author').value;
	let stock = document.querySelector('#book-stock').value;

	InsertRow(id,title,author,stock);
});

// Listener toogle display book
document.querySelector("#toogle-book").addEventListener("click", function(){
	let status = document.querySelector('#toogle-book');
	let table = document.querySelector('#whole-table');
	if (table.style.display == 'block'){
		status.innerHTML = 'Hide Book';
		table.style.display = 'none';
	} else {
		status.innerHTML = 'Show Book';
		table.style.display = 'block';
	}
});


// Default add book
function DefaultTable(count){
	let titles = ['Python 101','Javascript Expert','Typescript fundamental']
	let authors = ['Black Jack','John Murph','Elizabeth Ily']
	for (let i = 0; i < count; i++) {
		InsertRow(i,titles[i],authors[i],100)
	}
};
window.onload = DefaultTable(3);

// Cari buku
function CariBuku(){
	let books = []
	let table = document.querySelector('#perpus-table');

	
	// console.log(table.rows[1].cells[2].innerHTML)
};
document.querySelector('#cari-buku').addEventListener('click',function(){
	CariBuku();
});


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
		let interaction = document.querySelector('#interact-container')
		if (res==true){
			interaction.innerHTML = `${cari} found`
		} else{
			interaction.innerHTML = `Sorry, cant find ${cari}`
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

			let interaction = document.querySelector('#interact-container')
			interaction.innerHTML = `Berhasil meminjam ${data[1]}`

			// Pinjaman div
			let pinjaman = document.querySelector('#pinjaman')
			let node = document.createElement('DIV')
			let textnode = document.createTextNode(data[1])
			node.appendChild(textnode)
			pinjaman.appendChild(node)
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
		let interaction = document.querySelector('#interact-container');
		if (data[0]){
			let index = this.pinjaman[1][this.pinjaman[0].indexOf(buku)]
			// let value_now = getElementByXpath(`//*[@id="perpus-table"]/tr[${index}]/td[4]`).innerHTML;
			getElementByXpath(`//*[@id="perpus-table"]/tr[${index}]/td[4]`).innerHTML = Number(getElementByXpath(`//*[@id="perpus-table"]/tr[${index}]/td[4]`).innerHTML) + 1;
			this.pinjaman[0].splice(data[1],1);
			this.pinjaman[1].splice(this.pinjaman[0].indexOf(data[1]));
			console.log('Berhasil mengembalikan ',data[1]);
			interaction.innerHTML = `Berhasil mengembalikan ${data[1]}`

			// Update pinjaman div
			let pinjaman = document.querySelector('#pinjaman')
			let pinjaman_list = pinjaman.children
			for (let i = 0; i < pinjaman_list.length; i++) {
				if (pinjaman_list[i].innerHTML == data[1]){
					pinjaman.removeChild(pinjaman.childNodes[i])
					break
				}
			}
			return this
		} else if (data[0] == false){
			console.log('Anda tidak meminjam buku ',buku)
			interaction.innerHTML = `Anda tidak meminjam buku ${data[1]}`
			return this
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