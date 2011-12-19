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
    localStorage[item.id] = JSON.stringify(this);
  };
}

function Commission() {
  // TODO(icco): Figure out how Commissions work. What's the workflow?
  this.id = null;
}


// Pull in data from localStorage
function loadLocalStorageData(datatable) {
  for (var i = 0; i < localStorage.length; i++) {
    var str = localStorage[localStorage.key(i)];
    obj = JSON.parse(str);

    datatable.fnAddData([
      obj.id,
      obj.description,
      obj.type,
      obj.creator,
      obj.suggested_price,
      obj.sale_price,
    ]);

    console.log("Loaded: " + obj.id);
  }
}

function delRow(el) {

  console.log(el);

}

// Man document thread. Runs at page load.
$(document).ready(function() {

  // Natural Sorting support.
  jQuery.fn.dataTableExt.oSort['natural-asc']  = function(a,b) {
    return naturalSort(a,b);
  };

  jQuery.fn.dataTableExt.oSort['natural-desc'] = function(a,b) {
    return naturalSort(a,b) * -1;
  };

  // Tests!
  if (Modernizr.localstorage) { $('#storage-test').text('Yes'); }
  if (Modernizr.indexeddb) { $('#db-test').text('Yes'); }

  // Application code!

  // Build data table
  $('#items').dataTable({
    "bPaginate": false, // No pagination
    "bProcessing": true, // Show processing notification
    "bJQueryUI": true, // Use JQuery UI Themes
    "fnInitComplete": function() {
      // Load data from Local Storage
      loadLocalStorageData(this);
    },
    "aoColumns": [ // Specify how to sort columns
      { "sType": "natural" },
      null,
      null,
      null,
      { "sType": "natural" },
      { "sType": "natural" },
    ]
  })._fnReDraw(); // Force redraw
});
