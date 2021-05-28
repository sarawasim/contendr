$(document).ready(function () {
  $(".likes-container")
    .find("a")
    .on("click", function () {
      let splitClass = $(this).attr("class").split(" ");
      console.log("This class <a> tag " + splitClass);

      $.ajax("/like", {
        type: "POST", // http method
        data: { id: splitClass[0], player: splitClass[1] }, // data to submit
      });

      if ($(this).find("i").hasClass("fas")) {
        $(this).find("i").removeClass("fas");
        $(this).find("i").addClass("far");
        let likesNum = $(this).parent().find("p.likes").text();
        $(this)
          .parent()
          .find("p.likes")
          .text(`${parseInt(likesNum) - 1}`);
      } else {
        $(this).find("i").removeClass("far");
        $(this).find("i").addClass("fas");
        let likesNum = $(this).parent().find("p.likes").text();
        $(this)
          .parent()
          .find("p.likes")
          .text(`${parseInt(likesNum) + 1}`);

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
        if (otherLike.hasClass("fas")) {
          otherLike.removeClass("fas");
          otherLike.addClass("far");

          otherLike
            .closest(".likes-container")
            .find("p.likes")
            .text(`${parseInt(otherLikeNum - 1)}`);
        }
      }
    });
});
