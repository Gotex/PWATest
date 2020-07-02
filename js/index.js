window.addEventListener('load', () => {
	registerSW();
});

async function registerSW() {
	if('serviceWorker' in navigator) {
		try {
			await navigator.serviceWorker.register('sw.js');
		} catch (e) {
			console.log('SW registration failed');
		}
	}
}

let currentPlayers = 0;

const newPlayer = function(){
	let tRows = document.getElementsByTagName("tr");
	currentPlayers += 1;
	let idValue = "p" + currentPlayers;

	for(let i = 0; i < tRows.length; i++) {
		if(tRows[i].getAttribute("id") == "tHeader"){
			let th = document.createElement("th");

			let input = document.createElement("input");
			input.type = "text";
			input.id = idValue + "_name";
			input.placeholder = idValue;
			
			th.appendChild(input);
			tRows[i].appendChild(th);
		}
		else if (tRows[i].getAttribute("id") == "sum"){
			let td = document.createElement("td");

			td.id = idValue + "_sum";
			addClass(td, "blocking");
			addClass(td, "score");
			td.setAttribute("onclick", "toggleVisibility('"+td.id+"')");
			
			tRows[i].appendChild(td);
		}
		else{
			let td = document.createElement("th");

			let input = document.createElement("input");
			input.type = "number";
			input.id = idValue + "_" + i;
			input.setAttribute("onchange", "calcSum('"+idValue+"')");
			
			td.appendChild(input);
			tRows[i].appendChild(td);
		}
	}
};

const toggleVisibility = function(elementID){
	let element = document.getElementById(elementID);
	if(hasClass(element, "blocking"))
	removeClass(element, "blocking");
else
	addClass(element, "blocking");
};

const calcSum = function(playerID) {
	let tRows = document.getElementsByTagName("tr");
	let sum = 0;
	for (let i = 1; i < tRows.length - 1; i++) {
		let input = document.getElementById(playerID + "_" + i);
		sum += Number(input.value);
	}

	let sumTd = document.getElementById(playerID + "_sum");
	sumTd.innerHTML = sum;
};

const hasClass = function (el, className){
	if (el.classList)
		return el.classList.contains(className);
	return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

const addClass = function (el, className){
	if (el.classList)
		el.classList.add(className)
	else if (!hasClass(el, className))
		el.className += " " + className;
};

const removeClass = function (el, className){
	if (el.classList)
		el.classList.remove(className)
	else if (hasClass(el, className)){
		var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
		el.className = el.className.replace(reg, ' ');
	}
};

const toggleScore = function (){
	let scores = document.getElementsByClassName("score");
	let toggle = false;
	for (let i = 0; i<scores.length;i++){
		if(i == 0)
			toggle = hasClass(scores[i], "blocking");
		
		if(toggle)
			removeClass(scores[i], "blocking");
		else
			addClass(scores[i], "blocking");
	}
};