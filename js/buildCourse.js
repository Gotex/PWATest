const CLASSNAMES = {
  PLAYERSUM: 'playersum',
  HIDESUM: 'hideSum',
  HIDDEN: 'hidden',
  NUMBERUSERINPUT: 'numberUserInput',
  CAPTION: "caption"
};

var hideSum = true;
var playerCount = 0;
var eventListening = false;

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

var buildCourse = function (holecount, parList){
  setToDefault();

  var table = buildTable(holecount, parList);
  showTable(table);
};

var setToDefault = function (){
  hideSum = true;
  updateBtnShowHideSum();
  playerCount = 0;
};

var showHideSum = function (){
  hideSum = !hideSum;

  var playerSums = document.getElementsByClassName(CLASSNAMES.PLAYERSUM);
  for (var i = 0; i < playerSums.length; i++){
    if (hideSum){
      playerSums[i].classList.add(CLASSNAMES.HIDESUM);
    } else {
      playerSums[i].classList.remove(CLASSNAMES.HIDESUM);
    } 
  }

  updateBtnShowHideSum();
};

var updateBtnShowHideSum = function (){
  var btn = document.getElementById('btnShowHideSum');
  if (!btn){
    return;
  }

  if (hideSum){
    btn.innerText = "Ergebnis anzeigen";
  } else {
    btn.innerText = "Ergebnis verbergen";
  }
};

var showTable = function (table){
  var div = document.getElementById('tableContent');
  div.innerHTML = '';
  div.appendChild(table);

  var x = window.matchMedia("(orientation: portrait)")
  toggleTable(x)
  if(!eventListening)
    x.addListener(toggleTable)
};

var buildTable = function (holeCount, parList){
  var table = document.createElement('table');
  table.id = 'scorecard';
  table.setAttribute('holecount', holeCount)
  
  var headerRowHoles = createRow('hrHoles');

  var i = 0;
  for (i = 0; i <= holeCount; i++){ 
    var thHole;
    if(i == 0){
      thHole = createTh('hHoleCaption');     
      thHole.innerHTML = 'Loch';
    } else {
      thHole = createTh('hHole' + i);      
      thHole.innerHTML = i;
    }  
    headerRowHoles.appendChild(thHole);
  }

  var thHole = createTh('hHoleTotal');
  thHole.innerHTML = 'TOTAL';
  headerRowHoles.appendChild(thHole);

  table.appendChild(headerRowHoles);

  if(parList && (parList.length == holeCount)){
    var headerRowPar = createRow('hrPars');
    var parSum = 0;

    for (i = 0; i <= holeCount; i++){ 
      var thPar;
      if(i == 0){
        thPar = createTh('hParCaption');
        thPar.innerHTML = 'Par';
      } else {
        thPar = createTh('hPar' + i);
        thPar.innerHTML = parList[i - 1];
        parSum += parList[i - 1];
      }
      headerRowPar.appendChild(thPar);
    }

    var thPar = createTh('hPar' + i);
    thPar.innerHTML = parSum;
    headerRowPar.appendChild(thPar);

    table.appendChild(headerRowPar);
  }

  //addPlayerWithBodyAndHoleCount(table, holeCount);

  return table;
};

var addPlayer = function (){
  if (landscape == 1)
    switchTable();

  var table = document.getElementById('scorecard');
  if(!table){
    return;
  }

  var holeCount = table.getAttribute('holecount');
  var playerNo = ++playerCount;
  addPlayerWithBodyAndHoleCount(table, holeCount, playerNo, undefined, undefined);

  if(scorecardData){
    scorecardData.addPlayer(playerNo);
    saveToSessionStorage();
  }

  if (landscape == 1)
    switchTable();
};

var addPlayerWithScorecardData = function (){
  if(!scorecardData){
    throw "No ScorecardData available!";
  }

  if (landscape == 1)
    switchTable();

  var table = document.getElementById('scorecard');
  if(!table){
    return;
  }
  
  for(var i = 0; i < scorecardData.players.length; i++){
    addPlayerWithBodyAndHoleCount(table, scorecardData.holecount, 
      scorecardData.players[i].playerNo, scorecardData.players[i].name, scorecardData.players[i].scores);
  }
  
  playerCount = scorecardData.players.length;

  if (landscape == 1)
    switchTable();
};

var addPlayerWithBodyAndHoleCount = function (table, holeCount, playerNo, name, scores){
  var trs = table.getElementsByTagName('tr');
  var playerRow = createRow('p' + playerNo);
  var playerColumn = createTh ('p' + playerNo + 'Caption');
  playerColumn.setAttribute('PlayerNo', playerNo);
  var playerInput = document.createElement("input");
  playerInput.type = "text";
  playerInput.placeholder = "Name";
  if(name){
    playerInput.value = name;
  }
  playerInput.setAttribute('playerno', playerNo);
  playerInput.setAttribute('onchange', 'onPlayerChangeName(this)')

  playerColumn.appendChild(playerInput);
  playerRow.appendChild(playerColumn);
  
  var scoresum = 0;
  for (i = 1; i <= holeCount; i++){
    var playerHole = createTd ('p' + playerNo + 'Hole' + i);
    var playerHoleInput = document.createElement("input");
    playerHoleInput.type = "number";
    playerHoleInput.classList.add(CLASSNAMES.NUMBERUSERINPUT + 'p' + playerNo);
    playerHoleInput.setAttribute('playerno', playerNo);
    playerHoleInput.setAttribute('holeNo', i);
    playerHoleInput.setAttribute('onchange', 'onPlayerChangeScore(this)')
    if(scores){
      score = Number(scores[i - 1]);
      if (score != 0)
        playerHoleInput.value = score;
      scoresum += score;
    }
    playerHole.appendChild(playerHoleInput);
    playerRow.appendChild(playerHole);
  }

  var playerSum = createTd ('p' + playerNo + 'Sum');
  playerSum.classList.add(CLASSNAMES.PLAYERSUM);
  if(hideSum)
    playerSum.classList.add(CLASSNAMES.HIDESUM);

  playerSum.innerHTML = scoresum;
  playerRow.appendChild(playerSum);

  table.appendChild(playerRow);
};

var onPlayerChangeName = function (e){
  if(!scorecardData){
    return;
  }

  var playerNo = e.getAttribute('PlayerNo');
  scorecardData.setPlayerName(playerNo, e.value);
  saveToSessionStorage();
};

var onPlayerChangeScore = function (e){
  var playerNo = e.getAttribute('PlayerNo');
  if(scorecardData){
    var holeNo = e.getAttribute('holeNo');
    scorecardData.setPlayerScore(playerNo, holeNo, e.value);
    saveToSessionStorage();
  }

  var inputs = document.getElementsByClassName(CLASSNAMES.NUMBERUSERINPUT + 'p' + playerNo);
  var sum = 0;
  for (var i = 0; i < inputs.length; i++){
    sum += Number(inputs[i].value);
  }

  var playerSum = document.getElementById('p' + playerNo + 'Sum');

  playerSum.innerHTML = sum;
};

var createRow = function (idStr){
  var row = document.createElement('tr');
  row.id = idStr;
  
  return row;
};

var createTh = function (idStr){
  var th = document.createElement('td');
  th.classList.add(CLASSNAMES.CAPTION);
  th.id = idStr;
  
  return th;
};

var createTd = function (idStr){
  var td = document.createElement('td');
  td.id = idStr;
  
  return td;
};