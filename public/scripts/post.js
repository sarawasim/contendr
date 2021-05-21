$(document).ready(function () {
  $(".likes-container")
    .find("a")
    .on("click", function () {
      console.log(
        "$THIS IS " + JSON.stringify($(this).find("i").attr("class"))
      );
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

        // const otherLike = $(this).parent(".img-comp-img");
        // console.log(
        //   "$THIS SIBLING IS " + $(this).closest(".post-container").attr("class")
        // );
        let otherLike;

        if ($(this).find("i").hasClass("p1heart")) {
          otherLike = $(this).closest(".post-container").find(".p2heart");
        } else {
          otherLike = $(this).closest(".post-container").find(".p1heart");
        }
        let otherLikeNum = otherLike
          .closest(".likes-container")
          .find("p.likes")
          .text();
        console.log("THIS OTHER LIKE HAS " + otherLike.attr("class"));
        if (otherLike.hasClass("fas")) {
          otherLike.removeClass("fas");
          otherLike.addClass("far");
          console.log(
            "THIS OTHER LIKE HAS " +
              otherLike.closest(".likes-container").find("p.likes").text()
          );

          otherLike
            .closest(".likes-container")
            .find("p.likes")
            .text(`${parseInt(otherLikeNum - 1)}`);
          console.log(
            "THIS OTHER LIKE HAS " +
              otherLike.closest(".likes-container").find("p.likes").text()
          );
        }
      }
    });
});
