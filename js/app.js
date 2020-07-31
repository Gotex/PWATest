const MODES = {
  MAIN: "main",
  ADVENTURE: "adventure",
  MINIGOLF: "minigolf"
};
Object.freeze(MODES);

var scorecardData = undefined;

const SESSION_STORAGE_KEY_SCORECARD_DATA = "WagingScorecard";
var saveToSessionStorage = function (){
  if(!scorecardData){
    return;
  }

  var jsonStr = scorecardData.makeJson();
  window.localStorage.setItem(SESSION_STORAGE_KEY_SCORECARD_DATA, jsonStr);
};

var removeFromSessionStorage = function (){
  window.localStorage.removeItem(SESSION_STORAGE_KEY_SCORECARD_DATA); 
};

var getFromSessionStorage = function (){
  var jsonStr = window.localStorage.getItem(SESSION_STORAGE_KEY_SCORECARD_DATA);
  if(jsonStr){
    return jsonStr;
  }

  return null;
}

var ScorecardData = function (){
  this.mode = "";
  this.holecount = 0;
  this.players = [];  
  this.isSetup = false;
  
  this.setup = function (pmode, pholecount){
    this.mode = pmode;
    this.holecount = pholecount;
    this.isSetup = true;
  };

  this.setupJson = function (jsonObj){
    this.mode = jsonObj.mode;
    this.holecount = jsonObj.holecount;
    for(var i = 0; i < jsonObj.players.length; i++){
      var newPlayer = new PlayerData();
      newPlayer.setupJson(jsonObj.players[i]);
      this.players.push(newPlayer);
    }

    this.isSetup = true;
  };

  this.addPlayer = function (playerNo){
    if(!this.isSetup){
      throw "Object is not set up! Please use the setup() method";
    }

    var newPlayer = new PlayerData();
    newPlayer.setup(playerNo, this.holecount);
    this.players.push(newPlayer);
    return newPlayer;
  };
  
  this.getPlayer = function (playerNo){
    for(var i = 0; i < this.players.length; i++){
      if(this.players[i].playerNo == playerNo){
        return this.players[i];
      }
    }

    return undefined;
  };
  
  this.setPlayerName = function(playerNo, name){
    var player = this.getPlayer(playerNo);

    if(player){
      player.setName (name);
    }
  };
  
  this.setPlayerScore = function (playerNo, hole, score){
    var player = this.getPlayer(playerNo);
    
    if(player){
      player.setHoleScore (hole, score);
    }
  };

  this.makeJson = function (){
    return JSON.stringify(this, function (key, value){
      if(key === 'isSetup'){
        return undefined;
      }

      return value;
    });
  };

  this.getPlayerScores = function (){
    var playerScores = [];
    for(var i = 0; i < this.players.length; i++){
      var playerSum = this.players[i].getScoreSum();
      if(playerSum > 0){ 
        var playerObj = {
          player: (this.players[i].name == '' || this.players[i].name == undefined) ? this.players[i].playerNo : this.players[i].name,
          sum: playerSum
        };
        playerScores.push(playerObj);
      }
    }

    return playerScores;
  };

  this.getPlayerScoresSorted = function (){
    var playerScores = this.getPlayerScores();

    playerScores.sort(function (a,b){
      return a.sum - b.sum;
    });

    return playerScores;
  }

};

var PlayerData = function (){
  this.playerNo = 0;
  this.name = '';
  this.scores = [];

  this.setup = function (playerNo, holecount){
    this.playerNo = playerNo;
    for(var i = 0; i < holecount; i++){
      this.scores.push(0);
    }
  };
  
  this.setupJson = function (jsonObj){
    this.playerNo = jsonObj.playerNo;
    this.name = jsonObj.name;
    this.scores = jsonObj.scores;
  };

  this.setName = function (name){
    this.name = name;
  };
  
  this.setHoleScore = function (hole, score){
    this.scores[hole - 1] = score;
  };

  this.getScoreSum = function (){
    var sum = 0;
    for(var i = 0; i < this.scores.length; i++){
      sum += Number(this.scores[i]);
    }
    return sum;
  };
};

var showRanking = function (){
  var rankingStr = '';
  var scores = scorecardData.getPlayerScoresSorted();

  var modal = document.getElementById("myModal");

  if(modal){
    var contentDiv = document.getElementById("ranking-content");
    contentDiv.innerHTML = "";
    
    var divCaption = document.createElement("div");
    var classNameCaption = "rankingEntryCaption";
    divCaption.classList.add(classNameCaption);
    divCaption.classList.add("row");

    var picutreDivCaption = document.createElement("div");
    var picDivClassCaption = classNameCaption + "Pic";
    picutreDivCaption.classList.add(picDivClassCaption);
    picutreDivCaption.classList.add("col-2");
    var pRankCaption = document.createElement("h2");
    pRankCaption.innerText = "Platz";

    picutreDivCaption.appendChild(pRankCaption);
    divCaption.appendChild(picutreDivCaption);

    var nameDivCaption = document.createElement("div");
    var nameDivClassCaption = classNameCaption + "Name";
    nameDivCaption.classList.add(nameDivClassCaption);
    nameDivCaption.classList.add("col-5");

    var pNameCaption = document.createElement("h2");
    pNameCaption.innerText = "Name";
    
    nameDivCaption.appendChild(pNameCaption);
    divCaption.appendChild(nameDivCaption);

    var sumDivCaption = document.createElement("div");
    var sumDivClassCaption = classNameCaption + "Sum";
    sumDivCaption.classList.add(sumDivClassCaption);
    sumDivCaption.classList.add("col-5");

    var pSumCaption = document.createElement("h2");
    pSumCaption.innerText = "Punktzahl";

    sumDivCaption.appendChild(pSumCaption);
    divCaption.appendChild(sumDivCaption);

    contentDiv.appendChild(divCaption);

    for (var i = 0; i < scores.length; i++){
      var div = document.createElement("div");
      var className = "rankingEntry";
      if(i < 3){
        div.classList.add("rank" + (i+1));
      }
      div.classList.add(className);
      div.classList.add("row");

      var picutreDiv = document.createElement("div");
      var picDivClass = className + "Pic";
      picutreDiv.classList.add(picDivClass);
      picutreDiv.classList.add("col-2");
      var pRank = document.createElement("p");
      pRank.innerText = (i+1) + ".";

      picutreDiv.appendChild(pRank);
      div.appendChild(picutreDiv);

      var nameDiv = document.createElement("div");
      var nameDivClass = className + "Name";
      nameDiv.classList.add(nameDivClass);
      nameDiv.classList.add("col-5");

      var pName = document.createElement("p");
      pName.innerText = scores[i].player;
      
      nameDiv.appendChild(pName);
      div.appendChild(nameDiv);

      var sumDiv = document.createElement("div");
      var sumDivClass = className + "Sum";
      sumDiv.classList.add(sumDivClass);
      sumDiv.classList.add("col-5");

      var pSum = document.createElement("p");
      pSum.innerText = scores[i].sum;

      sumDiv.appendChild(pSum);
      div.appendChild(sumDiv);

      contentDiv.appendChild(div);
    }

    modal.style.display = "block";
  } else {
    for (var i = 0; i < scores.length; i++){
      if (i == 0){
        rankingStr = (i+1) + '. ' + scores[i].player + '\tPunkte: ' + scores[i].sum;
      } else {
        rankingStr += '\n' + (i+1) + '. ' + scores[i].player + '\tPunkte: ' + scores[i].sum;
      }
    }

    alert(rankingStr);

    newRound();
  }
};

var newRound = function (){
  removeFromSessionStorage();
  window.location.replace("../index.html");
};

var showRules = function (){
  var modal = document.getElementById("modalRules");
  if(!modal){
    return;
  }

  modal.style.display = "block";
};

var setupRankingModal = function (){
  var modal = document.getElementById("myModal");
  setupModal(modal);
};
var setupRulesModal = function(){
  var modal = document.getElementById("modalRules");
  setupModal(modal);
}

var setupModal = function (modal){
  if (!modal){
    return;
  }

  var span = modal.getElementsByClassName("close");
  if(span && span.length > 0){
    span[0].onclick = function() {
      //this.parentNode.parentNode.parentNode.style.display = "none";
      modal.style.display = "none";
    };
  }

  window.addEventListener("click", function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });  
}


var setupModals = function (){
  setupRankingModal();
  setupRulesModal();
};

window.addEventListener("load", setupModals);
