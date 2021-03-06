const ADVENTURE_COURSE = {
  HOLECOUNT: 18,
  PAR:[3,3,3,3,3,2,3,4,3,3,4,3,4,3,3,3,3,4]
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

var adjustFixedMenuSpacer = function (){
  var spacer = document.getElementById("fixedMenuSpacer");
  var menu = document.getElementById("fixedMenu");
  spacer.style.height = menu.scrollHeight + "px";
}

window.addEventListener("load", createAdventure);