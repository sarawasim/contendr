const challengeForm = document.querySelector("#challengeForm");
const challengeInput = document.querySelector(".challengeInput");
const submitForm = document.getElementById("submitForm");

submitForm.addEventListener("click", async (event) => {
  event.preventDefault();

  const inputMessage = missingInputs();

  if (inputMessage) {
    alert(inputMessage);
  } else {
    const file = challengeInput.files[0];
    debugger;
    //get secure url from our Server
    const { url } = await fetch("/s3Url").then((res) => res.json());

    //post image directly to the s3 bucket
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    //get s3 imageURL
    const imageURL = url.split("?")[0];

    // append this imageURL to hidden input somewhere on createChallenge.ejs
    let URLinput = document.createElement("INPUT");
    URLinput.setAttribute("type", "hidden");
    URLinput.setAttribute("value", imageURL);
    URLinput.setAttribute("name", "imageURL");
    let hiddenURL = document.getElementById("hiddenURL");
    hiddenURL.appendChild(URLinput);

    let fileInput = document.createElement("INPUT");
    fileInput.setAttribute("type", "hidden");
    fileInput.setAttribute("value", file.type);
    fileInput.setAttribute("name", "fileTypeInput");
    let hiddenInput = document.getElementById("fileType");
    hiddenInput.appendChild(fileInput);
    // submit form
    challengeForm.submit();
  }
});

function missingInputs() {
  const searchUser = document.forms["challengeForm"]["searchUser"].value;

  const category = document.getElementsByName("categoryInput");
  let catValue;
  for (let i = 0; i < category.length; i++) {
    if (category[i].checked) {
      catValue = category[i].value;
    }
  }

  const time = document.getElementsByName("timeInput");
  let timeValue;
  for (let i = 0; i < time.length; i++) {
    if (time[i].checked) {
      timeValue = time[i].value;
    }
  }

  const title = document.forms["challengeForm"]["titleInput"].value;
  const description = document.forms["challengeForm"]["descriptionInput"].value;
  const fileUpload = document.forms["challengeForm"]["fileUpload"].value;

  if (
    (searchUser == "" ||
      !catValue ||
      !timeValue ||
      title == "" ||
      description == "") &&
    fileUpload == ""
  ) {
    return "Please fill out entire form and upload a photo/GIF";
  } else if (fileUpload == "") {
    return "Please upload a photo/GIF";
  } else if (
    searchUser == "" ||
    !catValue ||
    !timeValue ||
    title == "" ||
    description == ""
  ) {
    return "Please fill out entire form";
  } else {
    return null;
  }
}
