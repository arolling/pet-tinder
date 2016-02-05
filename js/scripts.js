function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
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
  humanDB.open(refreshHumans);
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
    var newPerson = new Person(inputtedFirstName, inputtedLastName);

    var animalType = $("input:checkbox:checked.species").map(function(){
      newPerson.animalType.push((this).value);
    });

    var introvertedExtroverted = $("input[name=introvertedExtroverted]:checked").val();
    if (introvertedExtroverted) {
      newPerson.introvertedExtroverted = introvertedExtroverted;
    }
    var activeDocile = $("input[name=activeDocile]:checked").val();
    if (activeDocile) {
      newPerson.activeDocile = activeDocile;
    }
    var budget = $("select#budget").val();
    newPerson.budget = parseInt(budget);
    if (newPerson.animalType.length === 0){
      alert("Please select the type of animal or  you'd like to adopt!");
    }
    else {
      console.log(newPerson);
      humanDB.createHuman(newPerson, function(human) {
        refreshHumans();
      });
      matchPets(newPerson);
      $("#results").show();
      $("#search-results").show();
      $("#search-again").show();
      $("#search-form").hide();
    }
  });

  $('#allPetsButton').click(function(event) {
    event.preventDefault();
    $("#search-form").hide();
    $('#results').show();
    $("#search-results").hide();
    $("#search-again").show();
    $('#animalProfiles').show();
  })

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
    $("input[name=introvertedExtroverted]").attr("checked", false);
    $("input[name=activeDocile]").attr("checked", false);
    $("select#budget").val('20')
  });
});
