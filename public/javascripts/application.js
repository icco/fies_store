// @author Nat Welch (nat@natwelch.com)

$(document).ready(function() {

  // Tests!
  if (Modernizr.localstorage) { $('#storage-test').text('Yes'); }

  // Application code!

  // For storage, this is basics:
  localStorage["bar"] = "foo";
  console.log(localStorage["bar"]);


});
