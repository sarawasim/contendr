$(document).ready(function () {

  const $searchInput = $("#searchUser");
  $searchInput.on("input", () => {
    const input = $searchInput.val();
    const list = $("#followingList").val();
    let newList = list.split(",");

    const results = $.grep(newList, (name) => {
      return name.includes(input);
    });

    const li = results.map((name) => {
      return $(`<li class="results">${name}</li>`);
    });

    $("#searchResults").empty();
    $("#searchResults").append(li);
    console.log(li);
  });

  $("body").on("click", ".results", function () {
    console.log($(this).text());
    $($searchInput).val($(this).text());
    $("#searchResults").empty();
  });
});
