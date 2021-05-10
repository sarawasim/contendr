// function toggleSearch() {
//   let ele = document.getElementById("dropSearch");
//   if (ele.style.display == 'block') {
//     ele.style.display = 'none';
//   } else {
//     ele.style.display = 'block';
//   }
// }
// import {getUsername} from '../../controllers/userControllerMongo'


$(document).ready(function(){
  $('.toggleSearch').click(function() {
    let search = $(this).prev().val()
    // console.log(search)
    // let results = test.getUsername(search)
    // console.log(results)
    $('#dropSearch').toggle()
  })

  // function searchUsername(name) {
  //   const result = await $.get(`/createChallenge/username?search=${name}`)
  //   console.log(result)
  // }

  const $searchInput = $("#searchUser")
  $searchInput.on("input", ()=> {
    const input = $searchInput.val()
    const list = $("#followingList").val()
    let newList = list.split(',')

    const results = $.grep(newList, (name) => {
      return name.includes(input)
    })

    const li = results.map((name) => {
      return $(`<li class="results" value="${name}">${name}</li>`)
    })

    $("#searchResults").empty()
    $("#searchResults").append(li)
    console.log(li)
  })

  $("body").on("click", ".results", function () {
    console.log($(this).text())
    $($searchInput).val($(this).text()) 
    $("#searchResults").empty()
  })
})
