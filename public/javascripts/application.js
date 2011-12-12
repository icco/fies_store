// @author Nat Welch (nat@natwelch.com)
var DB_NAME = "FiesDatabase";
var DB_DESCRIPTION = "Item and Commission data for the Fies Store.";
var DB_VERSION = 1;

// Basic Inventory Unit
function Item() {
  this.id = null;
  this.type = "";
  this.description = "";
  this.creator = "";
  this.suggested_price = 0.0;
  this.sale_price = 0.0;

  this.init = function() {
    console.log('You instantiated a Class!');
  };
  this.save = function() {
    localStorage[item.id] = this;
  };
}

var data = [];
for (i = 0; i < 10; i++) {
  item = new Item();
  item.description = "descrip";
  item.type = "pin";
  item.creator = "kelly";
  item.suggested_price = 12.50;
  item.id = "item_" + localStorage.length;
  data[i] = item;
}

function Commission() {
  // TODO(icco): Figure out how Commissions work. What's the workflow?
  this.id = null;
}

// Man document thread. Runs at page load.
$(document).ready(function() {

  // Tests!
  if (Modernizr.localstorage) { $('#storage-test').text('Yes'); }
  if (Modernizr.indexeddb) { $('#db-test').text('Yes'); }

  // Application code!

  // IndexedDB spec is still evolving - see: http://www.w3.org/TR/IndexedDB/
  // various browsers keep it behind various flags and implementation varies.
  if ('webkitIndexedDB' in window) {
    window.indexedDB = window.webkitIndexedDB;
    window.IDBTransaction = window.webkitIDBTransaction;
  } else if ('mozIndexedDB' in window) {
    window.indexedDB = window.mozIndexedDB;
  }

  // TODO(icco): Figure out how you're fucking this up.
  //  * https://mikewest.org/2010/12/intro-to-indexeddb
  //  * https://developer.mozilla.org/en/IndexedDB/IDBDatabase
  //  * https://developer.mozilla.org/en/IndexedDB/IndexedDB_primer
  //  * http://www.html5rocks.com/en/tutorials/indexeddb/todo/
  var idb_; // Our local DB
  var idbRequest = window.indexedDB.open(DB_NAME, DB_DESCRIPTION, DB_VERSION);
  idbRequest.onsuccess = function (ev) {
    // Event's result is our successfully opened DB
    idb_ = this.result || ev.result;
    if (idb_.version == "") {
      var versionRequest = idb_.setVersion(DB_VERSION);
      versionRequest.onsuccess = function (ev) {
        idbRequest.onupgradeneeded(ev);
      };
    }

    var transaction = idb_.transaction(["items"], IDBTransaction.READ_WRITE);

    transaction.oncomplete = function (ev) {
      console.log("Transaction finished.");
    };

    transaction.onerror = function (ev) {
      // Don't forget to handle errors!
    };

      // Do something when all the data is added to the database.
      var objectStore = transaction.objectStore("items");
      for (var i in data) {
        var request = objectStore.add(data[i]);
        request.onsuccess = function(ev) {
          console.log("success");
        };
        request.onerror = function (ev) {
          console.log(ev);
        };
      }
  };

  idbRequest.onerror = function (ev) { console.log(ev); };

  // Run when the db version changes. This is the only place you can change
  // the structure of the database.
  idbRequest.onupgradeneeded = function (ev) {
    console.log(ev);

    // Creates an object store (think table), and defines the key path (think
    // primary key).
    var objectStore = idb_.createObjectStore("items", { keyPath: "id" });

    // Create three indexes that have no uniquness constraints.
    objectStore.createIndex("type", "type", { unique: false });
    objectStore.createIndex("description", "description", { unique: false });
    objectStore.createIndex("creator", "creator", { unique: false });
  };
});
