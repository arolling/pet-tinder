describe("Person", function(){
  it("creates a new profile for a human", function(){
    var testPerson = new Person("Daren", "Schaad", 35);
    expect(testPerson.firstName).to.equal("Daren");
    expect(testPerson.lastName).to.equal("Schaad");
    expect(testPerson.age).to.equal(35);
    expect(testPerson.budget).to.equal("");
    expect(testPerson.animalType).to.eql([]);
    expect(testPerson.personalityHuman).to.equal("");
  });
});

describe("Animal", function(){
  it("creates a new profile for an animal", function(){
    var testAnimal = new Animal("Astro");
    expect(testAnimal.animalName).to.equal("Astro");
    expect(testAnimal.ageCategory).to.equal("");
    expect(testAnimal.species).to.equal("");
    expect(testAnimal.breed).to.equal("");
    expect(testAnimal.temperament).to.eql([]);
    expect(testAnimal.profilePic).to.equal("");
  });
});
