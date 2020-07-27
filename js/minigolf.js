const MINIGOLF_COURSE = {
  HOLECOUNT: 18,
  PAR:[]
};

var createMinigolf = function (){
  buildCourse(MINIGOLF_COURSE.HOLECOUNT, MINIGOLF_COURSE.PAR);

  scorecardData = new ScorecardData();
  var scorecardExists = false;

  var jsonStr = getFromSessionStorage();
  if(jsonStr){
    var jsonObj = JSON.parse(jsonStr);
    scorecardData.setupJson(jsonObj);
    if(scorecardData.mode == MODES.MINIGOLF){
      addPlayerWithScorecardData();
      scorecardExists = true;
    }
    else{
      removeFromSessionStorage();
    }
  } 
  if (!scorecardExists) {
    scorecardData = new ScorecardData();
    scorecardData.setup(MODES.MINIGOLF, MINIGOLF_COURSE.HOLECOUNT);
    addPlayer();
  }
};

var showRanking = function (){
  alert("Hier kommt das Ranking");
  removeFromSessionStorage();
};

window.addEventListener("load", createMinigolf);

