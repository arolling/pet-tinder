/**
 * @file The main logic for the Todo List App.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */


var filterHumanResults = function(humans, pet) { // expects humans array, pet object
  //var remainingHumans = [];
  var speciesMatch = [];
  var activityMatch = [];
  var personalityMatch = [];
  var budgetMatch = [];
  console.log(humans, pet);

  for (var i=0; i < humans.length; i++) {
    console.log(humans[i].personObject.animalType);
    for (var j=0; j < humans[i].personObject.animalType.length; j++) {
      if (pet.species === humans[i].personObject.animalType[j]){
        speciesMatch.push(humans[i]);
      }
    }
  }
  console.log(speciesMatch);
  for (var i=0; i < speciesMatch.length; i++) {
    var thisHuman = speciesMatch[i].personObject;
    console.log(thisHuman);
    if (thisHuman.activeDocile === '' || pet.activity === thisHuman.activeDocile || pet.activity === '') {
      activityMatch.push(speciesMatch[i]);
    }
  }
  console.log(activityMatch);
  for (var i=0; i < activityMatch.length; i++) {
    var thisHuman = activityMatch[i].personObject;
    if (thisHuman.introvertedExtroverted === '' || pet.social === thisHuman.introvertedExtroverted || pet.social === '') {
      personalityMatch.push(activityMatch[i]);
    }
  }
  console.log(personalityMatch);
  for (var i=0; i < personalityMatch.length; i++) {
    var thisHuman = personalityMatch[i].personObject;
    if (matchHumanBudget(thisHuman, pet) === true) {
      budgetMatch.push(personalityMatch[i]);
    }
  }
  //console.log(activityMatch);
  return budgetMatch;
}

var matchHumanBudget = function(human, animal) {
  if (human.budget === 100) {
    return true;
  } else if (human.budget >= 80 && animal.animalWeight <= 80) {
    return true;
  } else if (human.budget >= 60 && animal.animalWeight <= 50 && animal.ageCategory != "Senior") {
    return true;
  } else if (human.budget >= 40 && animal.animalWeight <= 25 && (animal.ageCategory === "Young" || animal.ageCategory === "Adult")) {
    return true;
  } else if (human.budget >= 20 && animal.animalWeight <= 10 && (animal.ageCategory === "Young" || animal.ageCategory === "Adult")) {
    return true;
  } else {
    return false;
  }
}

function showProps(obj, objName) {
  var result = "";
  for (var i in obj) {
    if (obj.hasOwnProperty(i) && i != 'profilePic') {
        result += obj[i] + "<br>";
    }
  }
  // console.log(result);
  return result;
}


// Display full human results
function refreshHumans() {
  humanDB.fetchHumans(function(humans) {

    var humanList = document.getElementById('full-items');
    humanList.innerHTML = '';
    console.log(humans);

    for(var i = 0; i < humans.length; i++) {
      // Read the array items backwards (most recent first).
      var human = humans[(humans.length - 1 - i)];
      var li = document.createElement('li');
      var deleteButton = document.createElement('button');
      deleteButton.type = "button";
      deleteButton.className = "human-delete-button btn btn-danger";
      deleteButton.setAttribute("data-id", human.timestamp);
      deleteButton.innerHTML = "Delete";

      var editButton = document.createElement('button');
      editButton.type = "button";
      editButton.className = "human-edit-button btn btn-info";
      editButton.setAttribute("data-id", human.timestamp);
      editButton.innerHTML = "Edit";

      var span = document.createElement('span');
      var humanProps = showProps(human.personObject, 'human.personObject');
      span.innerHTML = humanProps;

      li.appendChild(span);
      li.appendChild(deleteButton);
      li.appendChild(editButton);
      humanList.appendChild(li);

      // Setup an event listener for the delete button.
      deleteButton.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));
        var deleteConfirm = confirm("Are you sure you want to delete this entry?");
        if (deleteConfirm === true){
          humanDB.deleteHuman(id, refreshHumans);
        }
        else {
          alert("The entry has not been deleted");
        }
      });

      // editButton.addEventListener('click', function(e) {
      //   var id = parseInt(e.target.getAttribute('data-id'));
      //   humanDB.editHuman(id, function(humanToEdit) {
      //     console.log(humanToEdit.personObject.species);
      //     $("input#new-human").val(humanToEdit.personObject.personName);
      //     $("#new-weight").val(humanToEdit.personObject.personWeight);
      //     $("input#" + humanToEdit.personObject.species).prop('checked', true);
      //     $("#new-breed").val(humanToEdit.personObject.breed);
      //     $("#animalAge").val(humanToEdit.personObject.ageCategory);
      //     $("#animalSocial").val(humanToEdit.personObject.social);
      //     $("#animalActivity").val(humanToEdit.personObject.activity);
      //     $("#new-pic").val(humanToEdit.personObject.profilePic);
      //     humanDB.deleteHuman(id, refreshHumans);
      //   });
      // });
    }
  });
}

function matchHumans(pet) {
  humanDB.fetchHumans(function(humans) {

    var humanList = document.getElementById('filtered-human-items');
    humanList.innerHTML = '';
    console.log(pet);
    var filteredHumans = filterHumanResults(humans, pet); //returns an array of person objects that match criteria
    for(var i = 0; i < filteredHumans.length; i++) {

      var human = filteredHumans[i];
      var li = document.createElement('li');
      li.setAttribute("data-id", human.timestamp);

      var span = document.createElement('span');

      var humanProps = showProps(human.personObject, 'human.personObject');
      span.innerHTML = humanProps;

      li.appendChild(span);

      humanList.appendChild(li);
    }
  });
}
