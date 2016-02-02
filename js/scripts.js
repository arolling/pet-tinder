function Person(firstName, lastName, age) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
  this.animalType = [];
  this.budget = "";
  this.introvertedExtroverted = "";
  this.activeDocile = "";
  // this.personalityHuman = "";
}

function Animal(animalName, animalWeight){
  this.animalName = animalName;
  this.animalWeight = animalWeight;
  this.ageCategory = "";
  this.species = "";
  this.breed = "";
  this.temperament = [];
  this.profilePic = "";
}

$(document).ready(function() {
  $("form#newPerson"). submit(function(event){
    event.preventDefault();
    var inputtedFirstName = $("input#firstName").val();
    var inputtedLastName = $("input#lastName").val();
    var inputtedAge = $("input#age").val();
    var newPerson = new Person(inputtedFirstName, inputtedLastName, inputtedAge);

    var animalType = $("input:checkbox:checked.species").map(function(){
      newPerson.animalType.push((this).value);
    });

    var introvertedExtroverted = $("input[name=introvertedExtroverted]:checked").val();
    newPerson.introvertedExtroverted = introvertedExtroverted;
    var activeDocile = $("input[name=activeDocile]:checked").val();
    newPerson.activeDocile = activeDocile;
    var budget = $("select#budget").val();
    newPerson.budget = budget;
    console.log(newPerson);

  });


});
