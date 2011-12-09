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
    localStorage[item.id] = this;
  };
}

function Commission() {
  // TODO(icco): Figure out how Commissions work. What's the workflow?
  this.id = null;
}

// Man document thread. Runs at page load.
$(document).ready(function() {

  // Tests!
  if (Modernizr.localstorage) { $('#storage-test').text('Yes'); }

  // Application code!
  if (!localStorage["items"]) { localStorage["items"] = []; }

  // For storage, this is basics:
  //localStorage["bar"] = "foo";
  //console.log(localStorage["bar"]);
});
