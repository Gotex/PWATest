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
  window.sessionStorage.setItem(SESSION_STORAGE_KEY_SCORECARD_DATA, jsonStr);
};

var removeFromSessionStorage = function (){
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY_SCORECARD_DATA); 
};

var getFromSessionStorage = function (){
  var jsonStr = window.sessionStorage.getItem(SESSION_STORAGE_KEY_SCORECARD_DATA);
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
      /*var playerObj = new Object();
      playerObj.player = (this.players[i].name == '' || this.players[i].name == undefined) ? this.players[i].playerNo : this.players[i].name;
      playerObj.sum = playerSum;*/
      var playerObj = {
        player: (this.players[i].name == '' || this.players[i].name == undefined) ? this.players[i].playerNo : this.players[i].name,
        sum: playerSum
      };
      playerScores.push(playerObj);
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

  for (var i = 0; i < scores.length; i++){
    if (i == 0){
      rankingStr = (i+1) + '. ' + scores[i].player + '\tPunkte: ' + scores[i].sum;
    } else {
      rankingStr += '\n' + (i+1) + '. ' + scores[i].player + '\tPunkte: ' + scores[i].sum;
    }
  }

  alert(rankingStr);
  removeFromSessionStorage();
  window.location.replace("../index.html");
};

var newRound = function (){
  removeFromSessionStorage();
  window.location.replace("../index.html");
}
