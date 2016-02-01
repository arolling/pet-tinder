function Pet(name, age){
  this.name = name;
  this.age = age;
}
// var success = function() {
//   alert('success');
// }
//
// var testme = function() {
//   var tester = petDB.open(success);
//   return tester
// }

/**
 * @file The main logic for the Todo List App.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */


window.onload = function() {

  // Display the todo items.
  petDB.open(refreshPets);


  // // Get references to the form elements.
  // var newTodoForm = document.getElementById('new-todo-form');
  // var newTodoInput = document.getElementById('new-todo');
  //
  //
  // Handle new todo item form submissions.
//  newTodoForm.onsubmit = function() {
    // Get the todo text.
//    var text = newTodoInput.value;
  testButton.onclick = function(){
    var animal = new Pet ('Bill', 12);
    // Check to make sure the text is not blank (or just spaces).

      // Create the todo item.
      petDB.createPet(animal, function(pet) {
        refreshPets();
      });

  }
    // Reset the input field.
    //newTodoInput.value = '';

    // Don't send the form.
  //  return false;
//  };

}

// Update the list of todo items.
function refreshPets() {
  petDB.fetchPets(function(pets) {
    var petList = document.getElementById('todo-items');
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
      span.innerHTML = pet.name + pet.age;

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
