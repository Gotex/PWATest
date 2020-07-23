const CLASSNAMES = {
  PLAYERSUM: 'playersum',
  HIDESUM: 'hideSum',
  HIDDEN: 'hidden',
  NUMBERUSERINPUT: 'numberUserInput',
  CAPTION: "caption"

};

const ADVENTURE_COURSE = {
  HOLECOUNT: 18,
  PAR:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
};

const MINIGOLF_COURSE = {
  HOLECOUNT: 18,
  PAR:[]
};

var hideSum = true;
var playerCount = 0;
var eventListening = false;

var buildAdventure = function(){
  setToDefault();

  var table = buildCourse(ADVENTURE_COURSE.HOLECOUNT, ADVENTURE_COURSE.PAR);
  showTable(table);
};

var buildMinigolf = function(){
  setToDefault ();

  var table = buildCourse(MINIGOLF_COURSE.HOLECOUNT, MINIGOLF_COURSE.PAR);
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
    btn.value = "Ergebnis anzeigen";
  } else {
    btn.value = "Ergebnis verbergen";
  }
};

var showTable = function (table){
  var div = document.getElementById('tableContent');
  div.innerHTML = '';
  div.appendChild(table);

  var scoreboard = document.getElementById('scoreboard');
  if(scoreboard.classList.contains(CLASSNAMES.HIDDEN)){
    scoreboard.classList.remove(CLASSNAMES.HIDDEN);
  }

  var mainmenu = document.getElementById('mainmenu');
  if(!mainmenu.classList.contains(CLASSNAMES.HIDDEN)){
    mainmenu.classList.add(CLASSNAMES.HIDDEN);
  }

  var x = window.matchMedia("(orientation: portrait)")
  toggleTable(x)
  if(!eventListening)
    x.addListener(toggleTable)
};

var buildCourse = function (holeCount, parList){
  var table = document.createElement('table');
  table.id = 'scorecard';
  table.setAttribute('holecount', holeCount)

  //var thead = document.createElement('thead');
  //var tbody = document.createElement('tbody');
  
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

  //thead.appendChild(headerRowHoles);
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

    //thead.appendChild(headerRowPar);
    table.appendChild(headerRowPar);
  }
  //table.appendChild(thead);

  addPlayerWithBodyAndHoleCount(table, holeCount);
  //table.appendChild(tbody);

  return table;
};

var addPlayer = function (){
  if (mode == 1)
    switchTable();

  var table = document.getElementById('scorecard');
  if(!table){
    return;
  }
  addPlayerWithTable(table);

  if (mode == 1)
    switchTable();
};

var addPlayerWithTable = function (table){
  var holeCount = table.getAttribute('holecount');
  //var tbodies = table.getElementsByTagName('tbody');
  //if(!tbodies){
  //  return;
  //}

  addPlayerWithBodyAndHoleCount(table, holeCount);
};

var addPlayerWithBodyAndHoleCount = function (table, holeCount){
  var trs = table.getElementsByTagName('tr');
  var playerNo = ++playerCount;

  var playerRow = createRow('p' + playerNo);
  var playerColumn = createTh ('p' + playerNo + 'Caption');
  playerColumn.setAttribute('PlayerNo', playerNo);
  var playerInput = document.createElement("input");
  playerInput.type = "text";
  playerInput.placeholder = "Name";
  playerInput.setAttribute('playerno', playerNo);

  playerColumn.appendChild(playerInput);
  playerRow.appendChild(playerColumn);

  for (i = 1; i <= holeCount; i++){
    var playerHole = createTd ('p' + playerNo + 'Hole' + i);
    var playerHoleInput = document.createElement("input");
    playerHoleInput.type = "number";
    playerHoleInput.classList.add(CLASSNAMES.NUMBERUSERINPUT + 'p' + playerNo);
    playerHoleInput.setAttribute('playerno', playerNo);
    playerHoleInput.setAttribute('onchange', 'onPlayerChangeScore(this)')
    /*playerHoleInput.onchange = function() {
      var inputs = playerRow.getElementsByClassName('numberUserInput');
      var sum = 0;
      for (var i = 0; i < inputs.length; i++){
        sum += Number(inputs[i].value);
      }

      var playerSum = document.getElementById('p' + playerNo + 'Sum');

      playerSum.innerHTML = sum;
    };*/
    playerHole.appendChild(playerHoleInput);
    playerRow.appendChild(playerHole);
  }

  var playerSum = createTd ('p' + playerNo + 'Sum');
  playerSum.classList.add(CLASSNAMES.PLAYERSUM);
  if(hideSum)
    playerSum.classList.add(CLASSNAMES.HIDESUM);

  playerSum.innerHTML = "0";
  playerRow.appendChild(playerSum);

  table.appendChild(playerRow);
};

var onPlayerChangeScore = function (e){
  var playerNo = e.getAttribute('PlayerNo');
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