// Set the date we're counting down to

let expDate = new Date(createdAtDate);
expDate.setMinutes(expDate.getMinutes() + 75);

var countDownDate = new Date(expDate).getTime();
console.log("Created At " + createdAtDate);
console.log("Countdown At " + countDownDate);
console.log("Expiration At " + expDate);

// Update the count down every 1 second
var x = setInterval(function () {
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Output the result in an element with id="demo"
  document.getElementById("expiration").innerHTML =
    days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

  // If the count down is over, it will disable likes by replacing the
  // <a> tag with an <i> tag
  if (distance < 0) {
    clearInterval(x);
    let likable = document.querySelectorAll(".likes-container a");
    likable.forEach(function (item) {
      let unlikable = document.createElement("i");
      item.removeAttribute("href");
      for (const attr of item.attributes) {
        unlikable.setAttribute(attr.name, attr.value);
      }
      unlikable.innerHTML = item.innerHTML;

      item.replaceWith(unlikable);
    });

    document.getElementById("expiration").innerHTML = "EXPIRED";
  }
}, 1000);
