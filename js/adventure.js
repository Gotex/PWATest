const ADVENTURE_COURSE = {
  HOLECOUNT: 18,
  PAR:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
};

var createAdventure = function (){
  buildCourse(ADVENTURE_COURSE.HOLECOUNT, ADVENTURE_COURSE.PAR);

  scorecardData = new ScorecardData();

  var jsonStr = getFromSessionStorage();
  if(jsonStr){
    var jsonObj = JSON.parse(jsonStr);
    scorecardData.setupJson(jsonObj);
    addPlayerWithScorecardData();
  } else {
    scorecardData.setup(MODES.ADVENTURE, ADVENTURE_COURSE.HOLECOUNT);
    addPlayer();
  }

};

var showRanking = function (){
  alert("Hier kommt das Ranking");
  removeFromSessionStorage();
};

window.addEventListener("load", createAdventure);