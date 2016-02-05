function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.animalType = [];
  this.budget = "";
  this.introvertedExtroverted = "";
  this.activeDocile = "";
  this.profilePic = '';
  this.bio = '';
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
  this.bio = '';
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
    newPerson.profilePic = $("input#new-human-pic").val();
      if (newPerson.profilePic === '') {
        newPerson.profilePic = "img/humandefault.jpg";
      } else {
        newPerson.profilePic = $("input#new-human-pic").val();
      }

    var animalType = $("input:checkbox:checked.species").map(function(){
      newPerson.animalType.push((this).value);
    });
    newPerson.bio = $('textarea#humanBio').val();
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
      $("#all-results").show();
      $("#search-form").hide();
      $("#animalProfiles").hide();
      $("#humanProfiles").hide();
      $("#full-results").hide();
    }
  });

 $("#favoritesbutton").click(function(event){
   var petfavArray = [];
   var humanfavArray = [];
   var favList = document.getElementById('allfavorites');

   $(".pet-favorite").each(function() {
     var id = parseInt($(this).attr("data-id"));
     petfavArray.push(id);
     console.log(petfavArray);
   });

   $(".human-favorite").each(function() {
     var id = parseInt($(this).attr("data-id"));
     humanfavArray.push(id);
     console.log(humanfavArray);
   });

   for(var i = 0; i < petfavArray.length; i ++) {
     petDB.editPet(petfavArray[i], function(petToEdit) {
       var li = document.createElement('li');
       var span = document.createElement('span');
       var petProps = showProps(petToEdit.animalObject, 'petToEdit.animalObject');
       var image = document.createElement('img');
       image.setAttribute('src', petToEdit.animalObject.profilePic);
       span.innerHTML = petProps;
       li.appendChild(image);
       li.appendChild(span);
       favList.appendChild(li);
     });
   }
   for(var i = 0; i < humanfavArray.length; i ++) {
     humanDB.editHuman(humanfavArray[i], function(humanToEdit) {
       var li = document.createElement('li');
       var span = document.createElement('span');
       var humanProps = showProps(humanToEdit.personObject, 'humanToEdit.personObject');
       span.innerHTML = humanProps;
       li.appendChild(span);
       favList.appendChild(li);
     });
   }

 });

  $('a.adopters').click(function(){
    $('#search-form').show();
    $('#petEntryForm').hide();
    $('#results').hide();
  });

  $('a.orphans').click(function(){
    $('#search-form').hide();
    $('#petEntryForm').show();
    $('#results').hide();
  });


  $('#allPetsButton').click(function(event) {
    event.preventDefault();
    $("#search-form").hide();
    $('#results').show();
    $("#search-results").hide();
    $("#search-again").show();
    $('#animalProfiles').show();
    $('#all-results').show();
    $("#humanProfiles").hide();
    $("#full-results").hide();
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
    $('textarea#humanBio').val('');
    $("input:checkbox:checked.species").removeAttr("checked");
    $("input[name=introvertedExtroverted]").attr("checked", false);
    $("input[name=activeDocile]").attr("checked", false);
    $("select#budget").val('20')
  });
});
