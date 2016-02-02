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
 human.activeDocile = 'Active';
 //humans.push(human);
 //console.log(humans);
 //end test object

var filterResults = function(pets, human) { // expects pets array, human object
  var remainingAnimals = [];
  //console.log(pets);

  for (var i=0; i < pets.length; i++) {
    console.log(pets[i].animalObject.species);
    for (var j=0; j < human.animalType.length; j++) {
      if (pets[i].animalObject.species === human.animalType[j]){
        remainingAnimals.push(pets[i]);
      }
    }
  }

  //console.log(pets);
  return remainingAnimals;
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
      animal.temperament.push($('select#animalSocial').val());
      animal.temperament.push($('select#animalActivity').val());
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
      span.innerHTML = pet.animalObject.animalName + "<br>" + pet.animalObject.animalWeight + "<br>" + pet.animalObject.species + "<br>" + pet.animalObject.breed + "<br>" + pet.animalObject.ageCategory + "<br>" + pet.animalObject.temperament + "<br>";
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
