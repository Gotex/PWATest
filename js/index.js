var landscape = false;
var prevLandscape = false;

var switchTable = function (){
  scorecard = document.getElementById('scorecard');
  if(!scorecard){
    return;
  }
  var newRows = [];

  var rows = scorecard.getElementsByTagName('tr');
  for (var rowIdx = 0; rowIdx < rows.length; rowIdx++){
    var newRowIdx = 0;
    var columns = rows[rowIdx].getElementsByTagName('td');
    for (var colIdx = 0; colIdx < columns.length; colIdx++){
      if(newRows[newRowIdx] === undefined) {
        newRows[newRowIdx] = document.createElement("tr");
      }
      newRows[newRowIdx].appendChild(columns[colIdx].cloneNode(true));
      newRowIdx++;
    }
  }
  
  for (var rowIdx = rows.length - 1; rowIdx >= 0; rowIdx--){
    scorecard.removeChild(rows[rowIdx]);
  }

  for (var i = 0; i < newRows.length; i++){
    scorecard.appendChild(newRows[i]);
  }
};

var toggleTable = function(x){
  if (x.matches) {
    landscape = true;
  } else {
    landscape = false;
  }
  
  if(landscape != prevLandscape){
    prevLandscape = landscape;
    switchTable();
  }
};

async function registerSW() {
	if('serviceWorker' in navigator) {
		try {
			await navigator.serviceWorker.register('sw.js');
		} catch (e) {
			console.log('SW registration failed');
		}
	}
}

window.addEventListener('load', () => {
	registerSW();
});