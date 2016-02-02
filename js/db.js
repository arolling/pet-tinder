var petDB = (function() {

  var pDB = {};
  var datastore = null;

  pDB.open = function(callback) {
    var version = 1;
    var request = indexedDB.open('pets', version);

    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      e.target.transaction.onerror = pDB.onerror;

      // Delete the old datastore.
      if (db.objectStoreNames.contains('pet')) {
        db.deleteObjectStore('pet');
      }

      // Create a new datastore.
      var store = db.createObjectStore('pet', {
        keyPath: 'timestamp'
      });
    };


    request.onsuccess = function(e) {
      datastore = e.target.result;
      callback();
    };

    request.onerror = pDB.onerror;
  };

  /**
   * Fetch all of the  items in the datastore.
   * @param {function} callback A function that will be executed once the items
   *                            have been retrieved. Will be passed a param with
   *                            an array of the  items.
   */
  pDB.fetchPets = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['pet'], 'readwrite');
    var objStore = transaction.objectStore('pet');

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var pets = [];

    transaction.oncomplete = function(e) {
      // Execute the callback function.
      callback(pets);
    };

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;

      if (!!result == false) {
        return;
      }

      pets.push(result.value);
      console.log(pets);
      result.continue();
    };

    cursorRequest.onerror = pDB.onerror;
  };

  /**
     * Create a new  item.
     * @param {string} text The  item.
     */
    pDB.createPet = function(animal, callback) {
      // Get a reference to the db.
      var db = datastore;

      // Initiate a new transaction.
      var transaction = db.transaction(['pet'], 'readwrite');

      // Get the datastore.
      var objStore = transaction.objectStore('pet');

      // Create a timestamp for the todo item.
      var timestamp = new Date().getTime();

      // Create an object for the todo item.
      var pet = {
        // 'petName': animal.animalName,
        // 'weight': animal.animalWeight,
        'animalObject': animal,
        'timestamp': timestamp
      };

      // Create the datastore request.
      var request = objStore.put(pet);

      // Handle a successful datastore put.
      request.onsuccess = function(e) {
        // Execute the callback function.
        callback(pet);
      };

      // Handle errors.
      request.onerror = pDB.onerror;
    };

    /**
   * Delete a pet item.
   * @param {int} id The timestamp (id) of the pet item to be deleted.
   * @param {function} callback A callback function that will be executed if the
   *                            delete is successful.
   */
  pDB.deletePet = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['pet'], 'readwrite');
    var objStore = transaction.objectStore('pet');

    var request = objStore.delete(id);

    request.onsuccess = function(e) {
      callback();
    }

    request.onerror = function(e) {
      console.log(e);
    }
  };

  console.log(pDB[1]);
  // Export the pDB object.
  return pDB;

}()); // end database

// request.onerror = function(event) {
//   console.log('error');
// }
// request.onerror = pDB.onerror;
// return version;
