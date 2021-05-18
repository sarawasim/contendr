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

        const otherLike = $(this).closest(".img-comp-img");
        if (otherLike.find("i").hasClass("fas")) {
          otherLike.find("i").removeClass("fas");
          otherLike.find("i").addClass("far");
        }
      }
    });
});
