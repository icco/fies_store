// @author Nat Welch (nat@natwelch.com)

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
    if (this.id == null)
      this.id = "item_" + localStorage.length;

    localStorage[this.id] = JSON.stringify(this);

    console.log("Saved: " + this.id);
  };
}

// Static function for Item loading.
Item.load = function(id) {

  // TODO(icco): Add checking to make sure this is a valid key.
  var str = localStorage[id];
  var obj = JSON.parse(str);

  var i = new Item();

  i.id = id;
  i.type = obj.type;
  i.description = obj.description;
  i.creator = obj.creator;
  i.suggested_price = obj.suggested_price;
  i.sale_price = obj.sale_price;


  console.log("Loaded: " + i.id);

  return i;
};

function Commission() {
  // TODO(icco): Figure out how Commissions work. What's the workflow?
  this.id = null;
}


// Pull in data from localStorage
function loadLocalStorageData(datatable) {
  for (var i = 0; i < localStorage.length; i++) {

    var obj = Item.load(localStorage.key(i))

    datatable.fnAddData([
      obj.id,
      obj.description,
      obj.type,
      obj.creator,
      obj.suggested_price.toFixed(2),
      obj.sale_price.toFixed(2),
    ]);
  }
}

// Static object for syncing
document.db = {
  addRow: function (arr) {
  },

  delRow: function (el) {
    console.log(el);
  },

  push: function () {
  },

  pull: function() {
  }
};


// Main document thread. Runs at page load.
$(document).ready(function() {

  // Tests!
  if (Modernizr.localstorage) { $('#storage-test').text('Yes'); }
  if (Modernizr.indexeddb) { $('#db-test').text('Yes'); }

  // Code to run only on pages with item listing.
  if ($('#items').length) {

    // Natural Sorting support.
    jQuery.fn.dataTableExt.oSort['natural-asc']  = function(a,b) {
      return naturalSort(a,b);
    };

    jQuery.fn.dataTableExt.oSort['natural-desc'] = function(a,b) {
      return naturalSort(a,b) * -1;
    };

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

    // Makes each field editable.
    $('td', $('#items').dataTable().fnGetNodes()).editable(function(value, settings) {
      var id = $(this).parent().children().html();

      var item = Item.load(id);

      item.description = $(this).parent().children()[1].innerText == "" ? value : item.description;
      item.type = $(this).parent().children()[2].innerText == "" ? value : item.type;
      item.creator = $(this).parent().children()[3].innerText == "" ? value : item.creator;
      item.suggested_price = $(this).parent().children()[4].innerText == "" ? parseFloat(value) : item.suggested_price;
      item.sale_price = $(this).parent().children()[5].innerText == "" ? parseFloat(value) : item.sale_price;
      item.save();

      // We must return what we want to display.
      return(value);
    });
  }
});
