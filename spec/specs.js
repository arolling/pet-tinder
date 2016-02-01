describe('Pet', function() {
  it('will create a test object', function() {
    var testPet = new Pet('Spot', 12);
    expect(testPet.name).to.equal('Spot');
    expect(testPet.age).to.equal(12);
  });
});
