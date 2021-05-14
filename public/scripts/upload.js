const challengeForm = document.querySelector("#challengeForm");
const challengeInput = document.querySelector(".challengeInput");
const submitForm = document.getElementById("submitForm");

submitForm.addEventListener("click", async (event) => {
  event.preventDefault();
  console.log(JSON.stringify(challengeInput));
  const file = challengeInput.files[0];

  //get secure url from our Server
  const { url } = await fetch("/s3Url").then((res) => res.json());
  console.log(url);

  //post image directly to the s3 bucket
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: file,
  });

  //get s3 imageURL
  const imageURL = url.split("?")[0];
  console.log(imageURL);

  // append this imageURL to hidden input somewhere on createChallenge.ejs
  let URLinput = document.createElement("INPUT");
  URLinput.setAttribute("type", "hidden");
  URLinput.setAttribute("value", imageURL);
  URLinput.setAttribute("name", "imageURL");
  let hiddenURL = document.getElementById("hiddenURL");
  hiddenURL.appendChild(URLinput);
  console.log(URLinput);

  // submit form
  challengeForm.submit();
  // const searchUser = $("input#searchUser");

  // const cat1 = $("input#cat1");
  // const cat2 = $("input#cat2");
  // const cat3 = $("input#cat3");
  // const cat4 = $("input#cat4");
  // const cat5 = $("input#cat5");
  // const cat6 = $("input#cat6");

  // let catRadio = false;
  // if (
  //   cat1.is(":checked") ||
  //   cat2.is(":checked") ||
  //   cat3.is(":checked") ||
  //   cat4.is(":checked") ||
  //   cat5.is(":checked") ||
  //   cat6.is(":checked")
  // ) {
  //   catRadio = true;
  // }

  // let timeRadio = false;
  // const time43200s = $("input#time43200s");
  // const time86400s = $("input#time86400s");
  // if (time43200s.is(":checked") || time86400s.is(":checked")) {
  //   timeRadio = true;
  // }

  // const titleInput = $("input#titleInput");
  // const descriptionInput = $("input#descriptionInput");

  // challengeForm.submit(function (event) {
  //   if (
  //     searchUser.value == "" ||
  //     !cat_radio ||
  //     !timeRadio ||
  //     titleInput.value == "" ||
  //     descriptionInput.value == ""
  //   ) {
  //     return false;
  //   }
  // });

  // Initialize form validation on the registration form.
  // It has the name attribute "registration"
  // $("#challengeForm").validate({
  //   // Specify validation rules
  //   rules: {
  //     // The key name on the left side is the name attribute
  //     // of an input field. Validation rules are defined
  //     // on the right side
  //     searchUser: "required",
  //     categoryInput: "required",
  //     timeInput: "required",
  //     titleInput: "required",
  //     descriptionInput: "required",
  //     fileUpload: "required",
  //   },
  //   // Specify validation error messages
  //   messages: {
  //     searchUser: "Please enter a user to challenge",
  //     categoryInput: "Please select a category",
  //     timeInput: "Please select a time limit",
  //     titleInput: "Please enter a title",
  //     descriptionInput: "Please enter a description",
  //     fileUpload: "please upload an image or gif",
  //   },
  //   // Make sure the form is submitted to the destination defined
  //   // in the "action" attribute of the form when valid
  //   submitHandler: function (form) {
  //     form.submit();
  //   },
  // });
});
