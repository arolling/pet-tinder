var humanDB = (function() {

  var hDB = {};
  var datastore = null;

  hDB.open = function(callback) {
    var version = 1;
    var request = indexedDB.open('humans', version);

    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      e.target.transaction.onerror = hDB.onerror;

      // Delete the old datastore.
      if (db.objectStoreNames.contains('human')) {
        db.deleteObjectStore('human');
      }

      // Create a new datastore.
      var store = db.createObjectStore('human', {
        keyPath: 'timestamp'
      });
    };


    request.onsuccess = function(e) {
      datastore = e.target.result;
      callback();
    };

    request.onerror = hDB.onerror;
  };

  /**
   * Fetch all of the  items in the datastore.
   * @param {function} callback A function that will be executed once the items
   *                            have been retrieved. Will be passed a param with
   *                            an array of the  items.
   */
  hDB.fetchHumans = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['human'], 'readwrite');
    var objStore = transaction.objectStore('human');

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var humans = [];

    transaction.oncomplete = function(e) {
      // Execute the callback function.
      callback(humans);
    };

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;

      if (!!result == false) { //ASK A TEACHER ABOUT THIS IF POSSIBLE????
        return;
      }

      humans.push(result.value);
      //console.log(humans);
      result.continue();
    };

    cursorRequest.onerror = hDB.onerror;
  };

  /**
     * Create a new  item.
     * @param {string} text The  item.
     */
    hDB.createHuman = function(person, callback) {
      // Get a reference to the db.
      var db = datastore;

      // Initiate a new transaction.
      var transaction = db.transaction(['human'], 'readwrite');

      // Get the datastore.
      var objStore = transaction.objectStore('human');

      // Create a timestamp for the todo item.
      var timestamp = new Date().getTime();

      // Create an object for the todo item.
      var human = {
        'personObject': person,
        'timestamp': timestamp
      };

      // Create the datastore request.
      var request = objStore.put(human);

      // Handle a successful datastore put.
      request.onsuccess = function(e) {
        // Execute the callback function.
        callback(human);
      };

      // Handle errors.
      request.onerror = hDB.onerror;
    };

    /**
   * Delete a human item.
   * @param {int} id The timestamp (id) of the human item to be deleted.
   * @param {function} callback A callback function that will be executed if the
   *                            delete is successful.
   */
  hDB.deleteHuman = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['human'], 'readwrite');
    var objStore = transaction.objectStore('human');

    var request = objStore.delete(id);

    request.onsuccess = function(e) {
      callback();
    }

    request.onerror = function(e) {
      console.log(e);
    }
  };

  hDB.editHuman = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['human'], 'readwrite');
    var objStore = transaction.objectStore('human');

    var request = objStore.get(id);

    request.onerror = function(e) {
      console.log(e);
    }

    request.onsuccess = function(e) {
      var result = request.result;
      console.log(result);
      callback(result);
    }
  };

  // Export the hDB object.
  return hDB;

}()); // end database
