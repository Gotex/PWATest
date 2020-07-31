const MINIGOLF_COURSE = {
  HOLECOUNT: 18,
  PAR:[2,2,3,3,2,3,3,3,3,2,2,2,3,2,4,3,3,2]
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

var adjustFixedMenuSpacer = function (){
  var spacer = document.getElementById("fixedMenuSpacer");
  var menu = document.getElementById("fixedMenu");
  spacer.style.height = menu.scrollHeight + "px";
}

window.addEventListener("load", createMinigolf);




