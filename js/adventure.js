const ADVENTURE_COURSE = {
  HOLECOUNT: 18,
  PAR:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
};

var createAdventure = function (){
  buildCourse(ADVENTURE_COURSE.HOLECOUNT, ADVENTURE_COURSE.PAR);

  scorecardData = new ScorecardData();
  var scorecardExists = false;

  var jsonStr = getFromSessionStorage();
  if(jsonStr){
    var jsonObj = JSON.parse(jsonStr);
    scorecardData.setupJson(jsonObj);
    if(scorecardData.mode == MODES.ADVENTURE){
      addPlayerWithScorecardData();
      scorecardExists = true;
    }
    else{
      removeFromSessionStorage();
    }
  } 
  if (!scorecardExists) {
    scorecardData = new ScorecardData();
    scorecardData.setup(MODES.ADVENTURE, ADVENTURE_COURSE.HOLECOUNT);
    addPlayer();
  }
};

var showRanking = function (){
  alert("Hier kommt das Ranking");
  removeFromSessionStorage();
};

window.addEventListener("load", createAdventure);