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
  for (var i = 0; i < localStorage.length; i++) {
    var str = localStorage[localStorage.key(i)];
    obj = JSON.parse(str);

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
      )
    );
  }

  $('#items').dataTable({ "bPaginate": false });
});
