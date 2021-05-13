const updateP2URL = document.querySelector("#updateP2URL");
const p2Input = document.querySelector(".p2Input");
const submitForm = document.getElementById("submitForm")

submitForm.addEventListener("click", async (event) => {
  event.preventDefault();
  console.log(JSON.stringify(p2Input));
  const file = p2Input.files[0];

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
  URLinput.setAttribute("name", "imageURL")
  let hiddenURL = document.getElementById("hiddenURL");
  hiddenURL.appendChild(URLinput);
  console.log(`this is urlinput from accept.js ${URLinput}`)

  // submit form 
  updateP2URL.submit();
});