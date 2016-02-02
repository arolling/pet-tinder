/**
 * @file The main logic for the Todo List App.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */

// function getRadioValue(radioName) {
//   for (var i=0; i<)
// }

window.onload = function() {

  // Display the todo items.
  petDB.open(refreshPets);

  // // Get references to the form elements.
  var newPetForm = document.getElementById('new-pet-form');
  var newPetName = document.getElementById('new-pet');
  var newPetWeight = document.getElementById('new-weight');
  var newBreed = document.getElementById('new-breed');
  // Age Category - radio buttons

  //temperament - docile/active, introvert/extrovert (pick 2)
  //profile pic - file url?
  // Handle new pet submissions.
  testButton.onclick = function(){
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

    for(var i = 0; i < pets.length; i++) {
      // Read the todo items backwards (most recent first).
      var pet = pets[(pets.length - 1 - i)];

      var li = document.createElement('li');
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "pet-checkbox";
      checkbox.setAttribute("data-id", pet.timestamp);

      li.appendChild(checkbox);

      var span = document.createElement('span');
      //span.innerHTML = pet.petName + pet.weight;
      span.innerHTML = pet.animalObject.animalName + " " + pet.animalObject.animalWeight + " " + pet.animalObject.species + " " + pet.animalObject.breed;

      li.appendChild(span);

      petList.appendChild(li);

      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        petDB.deletePet(id, refreshPets);
      });
    }

  });
}
