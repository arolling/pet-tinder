/**
 * @file The main logic for the Todo List App.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */


var filterResults = function(pets, human) { // expects pets array, human object
  //var remainingAnimals = [];
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

  for (var i=0; i < speciesMatch.length; i++) {
    var thisPet = speciesMatch[i].animalObject;
    if (human.activeDocile === '' || thisPet.activity === human.activeDocile || thisPet.activity === '') {
      activityMatch.push(speciesMatch[i]);
    }
  }

  for (var i=0; i < activityMatch.length; i++) {
    var thisPet = activityMatch[i].animalObject;
    if (human.introvertedExtroverted === '' || thisPet.social === human.introvertedExtroverted || thisPet.social === '') {
      personalityMatch.push(activityMatch[i]);
    }
  }

  for (var i=0; i < personalityMatch.length; i++) {
    var thisPet = personalityMatch[i].animalObject;
    if (matchBudget(thisPet, human) === true) {
      budgetMatch.push(personalityMatch[i]);
    }
  }
  console.log(budgetMatch);
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
      // for (var j in keys)
        result += obj[i] + "<br>";
      }
  }
  // console.log(result);
  return result;
};

window.onload = function() {

  // Display the items.
  petDB.open(refreshPets);


  // // Get references to the form elements.
  var newPetForm = document.getElementById('new-pet-form');
  var newPetName = document.getElementById('new-pet');
  var newPetWeight = document.getElementById('new-weight');
  var newBreed = document.getElementById('new-breed');
  //var newPic = document.getElementById('new-pic');
  //profile pic - file url?
  // Handle new pet submissions.
  allHumanButton.onclick = function(){
    humanDB.open(refreshHumans);
    $("#full-results").show();
    $("#petEntryForm").hide();
    $('#results').show();
    $('#all-results').show();
    $('#search-results').hide();
    $('#animalProfiles').hide();
    $('#humanProfiles').hide();
    return false;
  }

  addButton.onclick = function(){
    var newName = newPetName.value;
    var newWeight = newPetWeight.value;
    var newAge = $('select#animalAge').val();
    var newSpecies = document.getElementById('new-pet-form')['species'].value;

    // Check to make sure the text is not blank (or just spaces).
    if ((newName.replace(/ /g,'') != '') && (newWeight.replace(/ /g,'') != '')) {
      // Create the animal.
      newWeight = parseInt(newWeight);
      var animal = new Animal (newName, newWeight);
      animal.breed = newBreed.value;
      animal.species = newSpecies;
      animal.ageCategory = newAge;
      animal.social = $('select#animalSocial').val();
      animal.activity = $('select#animalActivity').val();
      animal.profilePic = $("input#new-pic").val();
        if (animal.profilePic === '') {
          animal.profilePic = "img/default.jpg";
        } else {
      animal.profilePic = $("input#new-pic").val();
        }
      console.log(animal);
      petDB.createPet(animal, function(pet) {
        refreshPets();
      });
      matchHumans(animal);
      $("#humanProfiles").show();
      $("#petEntryForm").hide();
      $("#full-results").hide();
      $('#results').show();
      $('#all-results').show();
      $('#search-results').hide();
      $('#animalProfiles').hide();

      newPetName.value = '';
      newPetWeight.value = '';
      newBreed.value = '';
      $("#Cat").prop("checked", true);
      $("#animalAge").val('');
      $("#animalSocial").val('');
      $("#animalActivity").val('');
      $("#new-pic").val('');
      // Reset the input field.
    }
    else {
      alert ("Please enter the animal's name and or weight before adding to the database");
    }
    // Don't send the form.
  return false;
  };

}

// Display All pet results
function refreshPets() {
  petDB.fetchPets(function(pets) {

    var petList = document.getElementById('pet-items');
    petList.innerHTML = '';
    console.log(pets);

    for(var i = 0; i < pets.length; i++) {
      // Read the array items backwards (most recent first).
      var pet = pets[(pets.length - 1 - i)];
      var li = document.createElement('li');
      var deleteButton = document.createElement('button');
      deleteButton.type = "button";
      deleteButton.className = "pet-delete-button btn btn-danger";
      deleteButton.setAttribute("data-id", pet.timestamp);
      deleteButton.innerHTML = "Delete";

      var editButton = document.createElement('button');
      editButton.type = "button";
      editButton.className = "pet-edit-button btn btn-info";
      editButton.setAttribute("data-id", pet.timestamp);
      editButton.innerHTML = "Edit";

      var matchButton = document.createElement('button');
      matchButton.type = "button";
      matchButton.className = "pet-match-button btn btn-success";
      matchButton.setAttribute("data-id", pet.timestamp);
      matchButton.innerHTML = "Matches";

      var span = document.createElement('span');
      var favoriteSpan = document.createElement('span');
      var image = document.createElement('img');
      var linebreak = document.createElement("br");
      var linebreak2 = document.createElement("br");
      var petProps = showProps(pet.animalObject, 'pet.animalObject');
      span.innerHTML = petProps;

      image.setAttribute('src', pet.animalObject.profilePic);
      favoriteSpan.className = "glyphicon glyphicon-star-empty";
      favoriteSpan.setAttribute("data-id", pet.timestamp);

      li.appendChild(image);

      li.appendChild(linebreak);
      li.appendChild(deleteButton);
      li.appendChild(editButton);
      li.appendChild(matchButton);
      li.appendChild(linebreak2);
      li.appendChild(span);

      li.appendChild(favoriteSpan);

      petList.appendChild(li);

      // Setup an event listener for the delete button.
      deleteButton.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));
        var deleteConfirm = confirm("Are you sure you want to delete this entry?");
        if (deleteConfirm === true){
          petDB.deletePet(id, refreshPets);
        }
        else {
          alert("The entry has not been deleted");
        }
      });

      matchButton.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));
        petDB.editPet(id, function(petToEdit) {
          var pet = petToEdit.animalObject;
          matchHumans(pet);
          $("#humanProfiles").show();
          $("#petEntryForm").hide();
          $("#full-results").hide();
          $('#results').show();
          $('#all-results').show();
          $('#search-results').hide();
          $('#animalProfiles').hide();
        });
      });

      editButton.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));
        petDB.editPet(id, function(petToEdit) {
          console.log(petToEdit.animalObject.species);
          $("input#new-pet").val(petToEdit.animalObject.animalName);
          $("#new-weight").val(petToEdit.animalObject.animalWeight);
          $("input#" + petToEdit.animalObject.species).prop('checked', true);
          $("#new-breed").val(petToEdit.animalObject.breed);
          $("#animalAge").val(petToEdit.animalObject.ageCategory);
          $("#animalSocial").val(petToEdit.animalObject.social);
          $("#animalActivity").val(petToEdit.animalObject.activity);
          $("#new-pic").val(petToEdit.animalObject.profilePic);
          petDB.deletePet(id, refreshPets);
          window.scrollTo(0,0);
        });
      });

      favoriteSpan.addEventListener('click', function(e) {
        if (this.className === "glyphicon glyphicon-star-empty") {
          this.className = "glyphicon glyphicon-star";
        } else if (this.className === "glyphicon glyphicon-star") {
          this.className = "glyphicon glyphicon-star-empty";
        }
      });
    }
  });
}

function matchPets(human) {
  petDB.fetchPets(function(pets) {

    var petList = document.getElementById('filtered-items');
    petList.innerHTML = '';

    var filteredPets = filterResults(pets, human); //returns an array of animal objects that match criteria
    console.log(filteredPets);
    for(var i = 0; i < filteredPets.length; i++) {

      var pet = filteredPets[i];
      var li = document.createElement('li');
      li.setAttribute("data-id", pet.timestamp);

      var span = document.createElement('span');
      var image = document.createElement('img');
      var favoriteSpan = document.createElement('span');
      var petProps = showProps(pet.animalObject, 'pet.animalObject');
      span.innerHTML = petProps;
      favoriteSpan.className = "glyphicon glyphicon-star-empty";
      favoriteSpan.setAttribute("data-id", pet.timestamp);
      image.setAttribute('src', pet.animalObject.profilePic);

      li.appendChild(image);
      li.appendChild(span);

      li.appendChild(favoriteSpan);
      petList.appendChild(li);

      favoriteSpan.addEventListener('click', function(e) {
        if (this.className === "glyphicon glyphicon-star-empty") {
          this.className = "glyphicon glyphicon-star";
        } else if (this.className === "glyphicon glyphicon-star") {
          this.className = "glyphicon glyphicon-star-empty";
        }
      });
    }
  });
}
