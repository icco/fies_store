// @author Nat Welch (nat@natwelch.com)

// Basic Inventory Unit
var Item = Class.create({
  id: null,
  type: "",
  description: "",
  creator: "",
  suggested_price: 0.0,
  sale_price: 0.0,

  init: function() {
    console.log('You instantiated a Class!');
  },
  save: function() {
    // TODO: Write save method to write to localStorage
  },
});

var Commission = Class.create({
  // TODO(icco): Figure out how Commissions work. What's the workflow?
  id: null,
});

// Man document thread. Runs at page load.
$(document).ready(function() {

  // Tests!
  if (Modernizr.localstorage) { $('#storage-test').text('Yes'); }

  // Application code!

  // For storage, this is basics:
  localStorage["bar"] = "foo";
  console.log(localStorage["bar"]);
});
