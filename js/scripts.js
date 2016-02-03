function Person(firstName, lastName, age) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
  this.animalType = [];
  this.budget = "";
  this.introvertedExtroverted = "";
  this.activeDocile = "";
}

function Animal(animalName, animalWeight){
  this.animalName = animalName;
  this.animalWeight = animalWeight;
  this.ageCategory = "";
  this.species = "";
  this.breed = "";
  this.social = "";
  this.activity = "";
  this.profilePic = "";
}

$(document).ready(function() {

  $("#checkAll").click(function(event) {
    $("input:checkbox.species").prop("checked", true);
    event.preventDefault();
  });

  $("#uncheckAll").click(function(event) {
    $("input:checkbox.species").prop("checked", false);
    event.preventDefault();
  });

  $("form#newPerson").submit(function(event){
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
    newPerson.budget = parseInt(budget);
    if (newPerson.animalType.length === 0){
      alert("Please select the type of animal or  you'd like to adopt!");
    }
    else {
      console.log(newPerson);
      $("#results").show();
      $("#search-form").hide();
      matchPets(newPerson);
    }
  });

  $("#revise-search").click(function(event){
    $("#search-form").show();
    $("#results").hide();
  });

  $("#new-search").click(function(event){
    $("#search-form").show();
    $("#results").hide();
    $("input#firstName").val('');
    $("input#lastName").val('');
    $("input:checkbox:checked.species").removeAttr("checked");
    $("input#inlineRadio1").prop("checked", true);
    $("input#inlineRadio3").prop("checked", true);
    $("select#budget").val('20')
  });
});
