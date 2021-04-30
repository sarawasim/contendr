const challengeForm = document.querySelector("#challengeForm");
const challengeInput = document.querySelector("#challengeInput");

challengeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
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

  const imageUrl = url.split("?")[0];
  console.log(imageUrl);
  //post request to the server to store any extra data
  /*make fetch request to give other details 
  after image Successfully uploaded*/

  //this is just test output vv
  const img = document.createElement("img");
  img.src = imageUrl;
  document.body.appendChild(img);
});
