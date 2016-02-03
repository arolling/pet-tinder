/**
 * @file The main logic for the Todo List App.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */

 // person object for testing
 var human = new Person('Bob', 'Smith', 55);
 //var humans = [];
 human.animalType.push("Cat");
 human.animalType.push("Lizard");
 human.animalType.push("Mouse");
 human.animalType.push('Snake');
 human.animalType.push("Rabbit");
 human.animalType.push("Dog");
 human.animalType.push("Hamster");
 //human.activeDocile = 'Active';
 human.introvertedExtroverted = "";
 human.budget = 100;
 //humans.push(human);
 //console.log(humans);
 //end test object

var filterResults = function(pets, human) { // expects pets array, human object
  var remainingAnimals = [];
  var speciesMatch = [];
  var activityMatch = [];
  var personalityMatch = [];
  var budgetMatch = [];
  //console.log(pets);

  for (var i=0; i < pets.length; i++) {
    console.log(pets[i].animalObject.species);
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

window.onload = function() {

  // Display the todo items.
  petDB.open(refreshPets);

  // // Get references to the form elements.
  var newPetForm = document.getElementById('new-pet-form');
  var newPetName = document.getElementById('new-pet');
  var newPetWeight = document.getElementById('new-weight');
  var newBreed = document.getElementById('new-breed');
  var newPic = document.getElementById('new-pic');
  //profile pic - file url?
  // Handle new pet submissions.
  addButton.onclick = function(){
    var newName = newPetName.value;
    var newWeight = newPetWeight.value;
    // Check to make sure the text is not blank (or just spaces).
    if ((newName.replace(/ /g,'') != '') || (newWeight.replace(/ /g,'') != '')) {
      // Create the animal.
      var animal = new Animal (newName, newWeight);
      animal.breed = newBreed.value;
      animal.species = document.getElementById('new-pet-form')['species'].value;
      animal.ageCategory = $('select#animalAge').val();
      animal.social = $('select#animalSocial').val();
      animal.activity = $('select#animalActivity').val();
      animal.profilePic = newPic.value;
      console.log(animal);
      petDB.createPet(animal, function(pet) {
        refreshPets();
      });
      newPetName.value = '';
      newPetWeight.value = '';
      newBreed.value = '';
    }
    // Reset the input field.


    // Don't send the form.
  return false;
  };

}

// Update the list of todo items.
function refreshPets() {
  petDB.fetchPets(function(pets) {

    var petList = document.getElementById('pet-items');
    petList.innerHTML = '';
    console.log(pets);
    var filteredPets = filterResults(pets, human); //returns an array of animal objects that match criteria
    for(var i = 0; i < filteredPets.length; i++) {
      // Read the array items backwards (most recent first).
      var pet = filteredPets[(filteredPets.length - 1 - i)];
      var li = document.createElement('li');
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "pet-checkbox";
      checkbox.setAttribute("data-id", pet.timestamp);

      li.appendChild(checkbox);

      var span = document.createElement('span');
      var image = document.createElement('img');
      span.innerHTML = pet.animalObject.animalName + "<br>" + pet.animalObject.animalWeight + "<br>" + pet.animalObject.species + "<br>" + pet.animalObject.breed + "<br>" + pet.animalObject.ageCategory + "<br>" + pet.animalObject.social + "<br>" + pet.animalObject.activity + "<br>";
      image.setAttribute('src', pet.animalObject.profilePic);

      li.appendChild(span);
      li.appendChild(image);

      petList.appendChild(li);

      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        petDB.deletePet(id, refreshPets);
      });

    }

  });
}
