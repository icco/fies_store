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
  for (var i = 0; i < localStorage.length; i++) {
    var str = localStorage[localStorage.key(i)];
    obj = JSON.parse(str);

    var sale_el = null;
    if (obj.sale_price > 0) {
      sale_el = obj.sale_price;
    } else {
      sale_el = $('<input>', {
        type: 'text',
        class: 'sale_price',
        size: 5,
        maxlength: 10,
        value: 0
      });
    }

    $("#items").find('tbody').append(
      $('<tr>').append(
      ).append(
        $('<td>').text(obj.id)
      ).append(
        $('<td>').text(obj.description)
      ).append(
        $('<td>').text(obj.type)
      ).append(
        $('<td>').text(obj.creator)
      ).append(
        $('<td>').text(obj.suggested_price)
      ).append(
        $('<td>').append(sale_el)
      )
    );
  }

  $('#items').dataTable({
    "bPaginate": false,
    "aoColumns": [
      null,
      null,
      null,
      { "sType": "natural-asc" },
      null
    ]
  });
});
