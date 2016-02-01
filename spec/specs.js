describe('Pet', function() {
  it('will create a test object', function() {
    var testPet = new Pet('Spot', 12);
    expect(testPet.name).to.equal('Spot');
    expect(testPet.age).to.equal(12);
  });
});

describe('petDB', function() {
  it('will open a database called petDB', function(){

    expect(petDB).to.equal(true); // hopefully returning our version number
  });
});
