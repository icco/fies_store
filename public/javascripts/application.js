// @author Nat Welch (nat@natwelch.com)
var DB_NAME = "fies_db";
var STORE_NAME = "fies_store";

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

function Commission() {
  // TODO(icco): Figure out how Commissions work. What's the workflow?
  this.id = null;
}

// Most of this code stolen and adapted for jquery from
// http://greenido.wordpress.com/2011/06/24/how-to-use-indexdb-code-and-example/
var indexedDbUtil = (function() {
  var idb_;           // Our local DB
  var idbRequest_;    // Our DB request obj

  // just a simple way to show what we are doing on the page
  var idbLog_ = $('#idb-log');
  var idResultsWrapper_ = $('#idb-results-wrapper');

  // IndexedDB spec is still evolving - see: http://www.w3.org/TR/IndexedDB/
  // various browsers keep it
  // behind various flags and implementation varies.
  if ('webkitIndexedDB' in window) {
    window.indexedDB = window.webkitIndexedDB;
    window.IDBTransaction = window.webkitIDBTransaction;
  } else if ('mozIndexedDB' in window) {
    window.indexedDB = window.mozIndexedDB;
  }

  // Open our IndexedDB if the browser supports it.
  if (window.indexedDB) {
    idbRequest_ = window.indexedDB.open(DB_NAME, "The Fies Store Database.");
    idbRequest_.onerror = idbError_;
    idbRequest_.addEventListener('success', function(e) {
      // FF4 requires e.result. IDBRequest.request isn't set
      // FF5/Chrome works fine.
      idb_ = idbRequest_.result || e.result;
      idbShow_(e);
    }, false);
  }

  // on errors - show us what is going wrong
  function idbError_(e) {
    idbLog_.innerHTML += '<p class="error">Error: ' +
      e.message + ' (' + e.code + ')</p>';
  }

  // In cases we add/remove objects - show the user what is changing in the DB
  function idbShow_(e) {
    if (!idb_.objectStoreNames.contains('myObjectStore')) {
      idbLog_.innerHTML = "<p>Object store not yet created.</p>";
      return;
    }

    var msgBoard = [];

    // Ready is default.
    var transaction = idb_.transaction(idb_.objectStoreNames, IDBTransaction.READ_ONLY);

    // Get all results.
    var request = transaction.objectStore(STORE_NAME).openCursor();

    // This callback will continue to be called until we have no more results.
    request.onsuccess = function(e) {
      // FF4 requires e.result. IDBRequest.request isn't set
      // FF5/Chrome works fine.
      var cursor = request.result || e.result;
      if (!cursor) {
        idResultsWrapper_.innerHTML = '<ul class="record-list" id="idb-results">' + msgBoard.join('') + '</ul>';
        return;
      }
      msgBoard.push('<li><span class="keyval" contenteditable onblur="indexedDbUtil.updateKey(\'',
        cursor.key, '\', this)">', cursor.key, '</span> ',
          '=> <span class="keyval" contenteditable onblur="indexedDbUtil.updateValue(\'',
        cursor.key, '\', this)">', cursor.value, '</span>&nbsp; ',
          '<a href="javascript:void(0)" onclick="indexedDbUtil.deleteKey(\'',
        cursor.key, '\')">[Delete]</a></li>');
      cursor.continue();
    }
    request.onerror = idbError_;
  }

  function idbCreate_() {
    if (!idb_) {
      if (idbRequest_) {
        // If indexedDB is still opening, just queue this up.
        idbRequest_.addEventListener('success', idb_.removeObjectStore, false);
      }
      return;
    }

    var request = idb_.setVersion('the new version string');
    request.onerror = idbError_;
    request.onsuccess = function(e) {
      if (!idb_.objectStoreNames.contains('myObjectStore')) {
        try {
          // FF is requiring the 2nd keyPath arg. It can be optional
          var objectStore = idb_.createObjectStore('myObjectStore', null);
          idbLog_.innerHTML = "<p>Object store created.</p>";
        } catch (err) {
          idbLog_.innerHTML = '<p class="error">' + err.toString() + '</p>';
        }
      } else {
        idbLog_.innerHTML = '<p class="error">Object store already exists.</p>';
      }
    }
  }

  function idbSet_() {
    if (!idb_) {
      if (idbRequest_) {
        // If indexedDB is still opening, just queue this up.
        idbRequest_.addEventListener('success', idb_.removeObjectStore, false);
      }
      return;
    }

    if (!idb_.objectStoreNames.contains('myObjectStore')) {
      idbLog_.innerHTML = "<p class=\"error\">Object store doesn't exist.</p>";
      return;
    }

    // Create a transaction that locks the world.
    var objectStore = idb_.transaction(idb_.objectStoreNames, IDBTransaction.READ_WRITE).objectStore(STORE_NAME);
    var request = objectStore.put(
      document.getElementById('idb-value').value,
      document.getElementById('idb-key').value
    );

    request.onerror = idbError_;
    request.onsuccess = idbShow_;
  }

  function updateKey_(key, element) {
    var newKey = element.textContent;

    // Create a transaction that locks the world.
    var transaction = idb_.transaction(idb_.objectStoreNames, IDBTransaction.READ_WRITE);

    var objectStore = transaction.objectStore(STORE_NAME);
    var request = objectStore.get(key);
    request.onerror = idbError_;
    request.onsuccess = function(e) {
      var value = e.result || this.result;
      if (objectStore.delete) {
        var request = objectStore.delete(key);
      } else {
        // FF4 not up to spect
        var request = objectStore.remove(key);
      }

      request.onerror = idbError_;
      request.onsuccess = function(e) {
        var request = objectStore.add(value, newKey);
        request.onerror = idbError_;
        request.onsuccess = idbShow_;
      };
    };
  }

  function updateValue_(key, element) {
    // Create a transaction that locks the world.
    var transaction = idb_.transaction(idb_.objectStoreNames, IDBTransaction.READ_WRITE);
    var objectStore = transaction.objectStore(STORE_NAME);
    var request = objectStore.put(element.textContent, key);
    request.onerror = idbError_;
    request.onsuccess = idbShow_;
  }

  function deleteKey_(key) {
    // Create a transaction that locks the world.
    var transaction = idb_.transaction(idb_.objectStoreNames, IDBTransaction.READ_WRITE);
    var objectStore = transaction.objectStore(STORE_NAME);
    if (objectStore.delete) {
      var request = objectStore.delete(key);
    } else {
      // FF4 not up to spect
      // FF5 and Chrome - are by the book :)
      var request = objectStore.remove(key);
    }

    request.onerror = idbError_;
    request.onsuccess = idbShow_;
  }

  function idbRemove_() {
    if (!idb_) {
      if (idbRequest_) {
        // If indexedDB is still opening, just queue this up.
        idbRequest_.addEventListener('success', idb_.removeObjectStore, false);
      }
      return;
    }

    var request = idb_.setVersion("the new version string");
    request.onerror = idbError_;
    request.onsuccess = function(e) {
      if (idb_.objectStoreNames.contains('myObjectStore')) {
        try {
          // Spec has been updated to deleteObjectStore.
          if (idb_.deleteObjectStore) {
            idb_.deleteObjectStore('myObjectStore');
          } else {
            idb_.removeObjectStore('myObjectStore');
          }

          idResultsWrapper_.innerHTML = '';
          idbLog_.innerHTML = "<p>Object store removed.</p>";
        } catch (err) {
          idbLog_.innerHTML = '<p class="error">' + err.toString() + '</p>';
        }
      } else {
        idbLog_.innerHTML = "<p class=\"error\">Object store doesn't exist.</p>";
      }
    };
  }

  return {
    idbSet: idbSet_,
    idbCreate: idbCreate_,
    idbRemove: idbRemove_,
    updateKey: updateKey_,
    updateValue: updateValue_,
    deleteKey: deleteKey_,
  }
})();

// Man document thread. Runs at page load.
$(document).ready(function() {

  // Tests!
  if (Modernizr.localstorage) { $('#storage-test').text('Yes'); }
  if (Modernizr.indexeddb) { $('#db-test').text('Yes'); }

  // Application code!

});
