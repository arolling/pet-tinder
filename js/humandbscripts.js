/**
 * @file The main logic for the Todo List App.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */


var filterResults = function(pets, human) { // expects pets array, human object
  var remainingAnimals = [];
  var speciesMatch = [];
  var activityMatch = [];
  var personalityMatch = [];
  var budgetMatch = [];
  console.log(human, pets);

  for (var i=0; i < pets.length; i++) {
    //console.log(pets[i].animalObject.species);
    for (var j=0; j < human.animalType.length; j++) {
      var thisPet = pets[i].animalObject;
      if (thisPet.species === human.animalType[j]){
        speciesMatch.push(pets[i]);
      }
    }
  }
  console.log(speciesMatch);
  for (var i=0; i < speciesMatch.length; i++) {
    var thisPet = speciesMatch[i].animalObject;
    if (human.activeDocile === '' || thisPet.activity === human.activeDocile || thisPet.activity === '') {
      activityMatch.push(speciesMatch[i]);
    }
  }
  console.log(activityMatch);
  for (var i=0; i < activityMatch.length; i++) {
    var thisPet = activityMatch[i].animalObject;
    if (human.introvertedExtroverted === '' || thisPet.social === human.introvertedExtroverted || thisPet.social === '') {
      personalityMatch.push(activityMatch[i]);
    }
  }
  console.log(speciesMatch);
  for (var i=0; i < personalityMatch.length; i++) {
    var thisPet = personalityMatch[i].animalObject;
    if (matchBudget(thisPet, human) === true) {
      budgetMatch.push(personalityMatch[i]);
    }
  }
  //console.log(activityMatch);
  return budgetMatch;
}

var matchBudget = function(animal,human) {
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

// window.onload = function() {
//
//   // Display the items.
//   humanDB.open(refreshHumans);
//
//
//   // // Get references to the form elements.
//   var newPersonForm = document.getElementById('newPerson');
//   var newFirstName = document.getElementById('firstName');
//   var newLastName = document.getElementById('lastName');
//
//
//   // Handle new human submissions.
//   addHumanButton.onclick = function(){
//     var newPersonFirstName = newFirstName.value;
//     var newSurname = newLastName.value;
//     var newBudget = $('select#budget').val();
//     var newIntroExtro = document.getElementById('newPerson')['introvertedExtroverted'].value;
//     var newActivity = document.getElementById('newPerson')['activeDocile'].value;
//
//     // Check to make sure the text is not blank (or just spaces).
//     if ((newName.replace(/ /g,'') != '') && (newWeight.replace(/ /g,'') != '')) {
//       // Create the person.
//       var person = new Person (newPersonFirstName, newSurname);
//       var animalType = $("input:checkbox:checked.species").map(function(){
//         person.animalType.push((this).value);
//       });
//
//       animal.breed = newBreed.value;
//       animal.species = newSpecies;
//       animal.ageCategory = newAge;
//       animal.social = $('select#animalSocial').val();
//       animal.activity = $('select#animalActivity').val();
//       animal.profilePic = $("input#new-pic").val();
//         if (animal.profilePic === '') {
//           animal.profilePic = "img/default.jpg";
//         } else {
//       animal.profilePic = $("input#new-pic").val();
//         }
//       console.log(animal);
//       humanDB.createPet(animal, function(human) {
//         refreshHumans();
//       });
//       newPetName.value = '';
//       newPetWeight.value = '';
//       newBreed.value = '';
//       // Reset the input field.
//     }
//     else {
//       alert ("Please enter the animal's name and or weight before adding to the database");
//     }
//     // Don't send the form.
//   return false;
//   };
// }

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
      //var image = document.createElement('img');
      var humanProps = showProps(human.personObject, 'human.personObject');
      span.innerHTML = humanProps;

      //image.setAttribute('src', human.personObject.profilePic);

      li.appendChild(span);
      //li.appendChild(image);
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

function matchHumans(human) {
  humanDB.fetchHumans(function(humans) {

    var humanList = document.getElementById('filtered-items');
    humanList.innerHTML = '';
    console.log(human);
    var filteredHumans = filterResults(humans, human); //returns an array of person objects that match criteria
    for(var i = 0; i < filteredHumans.length; i++) {

      var human = filteredHumans[i];
      var li = document.createElement('li');
      li.setAttribute("data-id", human.timestamp);

      var span = document.createElement('span');
      var image = document.createElement('img');
      var humanProps = showProps(human.personObject, 'human.personObject');
      span.innerHTML = humanProps;

      image.setAttribute('src', human.personObject.profilePic);

      li.appendChild(span);
      li.appendChild(image);

      humanList.appendChild(li);

    }
  });
}
