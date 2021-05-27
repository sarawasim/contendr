// Set the date we're counting down to

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

  // Output the result in an element with id="expiration"
  document.getElementById("expiration").innerHTML =
    hours + "h " + minutes + "m " + seconds + "s ";

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

    let results;
    if ( p1Likes > p2Likes) {
      results = `${player1} is the winner!`
    } else if (p1Likes == p2Likes) {
      console.log((p1Likes))
      console.log((p2Likes))
      results = "It was a tie!"
    } else {
      results = `${player2} is the winner!`
    }

    document.getElementById("expiration").innerHTML =
      results;
  }
}, 250);

let createdAgo = function () {
  // Get today's date and time
  let now = new Date().getTime();

  let createdAt = new Date(createdAtDate).getTime();

  let createdLocale = new Date(createdAtDate).toLocaleString("default", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  console.log("locale " + createdLocale);

  // Find the distance between now and the count down date
  let distance = now - createdAt;

  // Time calculations for days, hours, minutes and seconds
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Output the result in an element with id="demo"

  const pCreatedAt = document.getElementById("createdAt");
  if (days > 31) {
    pCreatedAt.innerHTML = `Created on ${createdLocale}`;
  } else if (days) {
    if (days == 1) {
      pCreatedAt.innerHTML = `Created 1 day ago`;
    } else {
      pCreatedAt.innerHTML = `Created ${days} days ago`;
    }
  } else if (hours) {
    if (hours == 1) {
      pCreatedAt.innerHTML = `Created an hour ago`;
    } else {
      pCreatedAt.innerHTML = `Created ${hours} hours ago`;
    }
  } else if (minutes) {
    if (minutes == 1) {
      pCreatedAt.innerHTML = `Created a minutes ago`;
    } else {
      pCreatedAt.innerHTML = `Created ${minutes} minutes ago`;
    }
  } else {
    pCreatedAt.innerHTML = `Created a minute ago`;
  }
  // document.getElementById("createdAt").innerHTML =
  //   hours + "h " + minutes + "m " + seconds + "s ";
};
createdAgo();
