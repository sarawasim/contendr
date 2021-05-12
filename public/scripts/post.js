$(document).ready(() => {
  $(".likes-container")
    .find("a")
    .on("click", function (e) {
      if ($(this).find("i").hasClass("fas")) {
        $(this).find("i").removeClass("fas");
        $(this).find("i").addClass("far");
        let likesNum = $(this).parent().find("p.likes").text();
        $(this)
          .parent()
          .find("p.likes")
          .text(`${parseInt(likesNum) - 1}`);
        console.log($(this).parent().find("p.likes").text());
      } else {
        $(this).find("i").removeClass("far");
        $(this).find("i").addClass("fas");
        let likesNum = $(this).parent().find("p.likes").text();
        $(this)
          .parent()
          .find("p.likes")
          .text(`${parseInt(likesNum) + 1}`);
        console.log($(this).parent().find("p.likes").text());
      }
      console.log("the likes button was pressed");
    });
});
