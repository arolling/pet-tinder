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

  for (var i=0; i < humans.length; i++) {
    for (var j=0; j < humans[i].personObject.animalType.length; j++) {
      if (pet.species === humans[i].personObject.animalType[j]){
        speciesMatch.push(humans[i]);
      }
    }
  }
  //console.log(speciesMatch);
  for (var i=0; i < speciesMatch.length; i++) {
    var thisHuman = speciesMatch[i].personObject;
    console.log(thisHuman);
    if (thisHuman.activeDocile === '' || pet.activity === thisHuman.activeDocile || pet.activity === '') {
      activityMatch.push(speciesMatch[i]);
    }
  }
  //console.log(activityMatch);
  for (var i=0; i < activityMatch.length; i++) {
    var thisHuman = activityMatch[i].personObject;
    if (thisHuman.introvertedExtroverted === '' || pet.social === thisHuman.introvertedExtroverted || pet.social === '') {
      personalityMatch.push(activityMatch[i]);
    }
  }
  //console.log(personalityMatch);
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

      var matchButton = document.createElement('button');
      matchButton.type = "button";
      matchButton.className = "human-match-button btn btn-success";
      matchButton.setAttribute("data-id", human.timestamp);
      matchButton.innerHTML = "Matches";

      var span = document.createElement('span');
      var favoriteSpan = document.createElement('span');
      var humanProps = showProps(human.personObject, 'human.personObject');
      span.innerHTML = humanProps;
      var linebreak = document.createElement("br");
      var linebreak2 = document.createElement("br");

      var image = document.createElement('img');
      image.setAttribute('src', human.personObject.profilePic);
      li.appendChild(image);

      favoriteSpan.className = "glyphicon glyphicon-star-empty";
      favoriteSpan.setAttribute("data-id", human.timestamp);
      li.appendChild(image);
      li.appendChild(linebreak);
      li.appendChild(deleteButton);
      li.appendChild(editButton);
      li.appendChild(matchButton);
      li.appendChild(linebreak2);
      li.appendChild(span);
      li.appendChild(favoriteSpan);
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

      matchButton.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));
        humanDB.editHuman(id, function(humanToEdit) {
          var human = humanToEdit.personObject;
          matchPets(human);
          $('#results').show();
          $('#all-results').show();
          $('#search-results').hide();
          $('#animalProfiles').show();
          $("#humanProfiles").hide();
          $("#petEntryForm").hide();
          $("#full-results").hide();
        });
      });

      favoriteSpan.addEventListener('click', function(e) {
        if (this.className === "glyphicon glyphicon-star-empty") {
          this.className = "glyphicon glyphicon-star human-favorite";
        } else if (this.className === "glyphicon glyphicon-star human-favorite") {
          this.className = "glyphicon glyphicon-star-empty";
        }
      });

      editButton.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));
        humanDB.editHuman(id, function(humanToEdit) {
          console.log(humanToEdit.personObject.firstName);
          $("input#firstName").val(humanToEdit.personObject.firstName);
          $("input#lastName").val(humanToEdit.personObject.lastName);
          humanToEdit.personObject.animalType.forEach(function(type){
            if (type != ''){
              $('input[value=' + type + ']').prop('checked', true);
            }
          });
          if (humanToEdit.personObject.introvertedExtroverted != ''){
            $('input[value=' + humanToEdit.personObject.introvertedExtroverted + ']').prop('checked', true);
          }
          if (humanToEdit.personObject.activeDocile != ''){
            $('input[value=' + humanToEdit.personObject.activeDocile + ']').prop('checked', true);
          }
          $("#budget").val(humanToEdit.personObject.budget);
          $('#humanBio').val(humanToEdit.personObject.bio);
          $("#new-human-pic").val(humanToEdit.personObject.profilePic);
          $("#results").hide();
          $("#search-form").show();
          humanDB.deleteHuman(id, refreshHumans);
        });
      });
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
      var favoriteSpan = document.createElement('span');
      var humanProps = showProps(human.personObject, 'human.personObject');
      span.innerHTML = humanProps;
      favoriteSpan.className = "glyphicon glyphicon-star-empty";
      favoriteSpan.setAttribute("data-id", human.timestamp);
      var linebreak = document.createElement("br");
      var image = document.createElement('img');
      image.setAttribute('src', human.personObject.profilePic);

      li.appendChild(image);
      li.appendChild(linebreak);
      li.appendChild(span);
      li.appendChild(favoriteSpan);
      humanList.appendChild(li);
      favoriteSpan.addEventListener('click', function(e) {
        if (this.className === "glyphicon glyphicon-star-empty") {
          this.className = "glyphicon glyphicon-star human-favorite";
        } else if (this.className === "glyphicon glyphicon-star human-favorite") {
          this.className = "glyphicon glyphicon-star-empty";
        }
      });
    }
  });
}
