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
    console.log(list)
    let newList = list.split(',')
    console.log(newList)
    // console.log(searchUsername(list))
    const results = $.grep(newList, (name) => {
      return name.includes(input)
    })
    // const filteredList = list.filter(name => name.toLowerCase().includes(input))
    // console.log(filteredList)
    console.log(input)
    console.log(results)
    const li = results.map((name) => {
      return $(`<div class="test" value="${name}">${name}</div>`)
    })

    // function createDOM () {
    //   let domArr = []
    //   for(let i=0; results.length<i; i++) {
    //     console.log(i)
    //     domArr.push(`<li id=result[${i}]> ${results[i]} </li>`)
    //   }
    //   console.log(domArr)
    //   return domArr
    // }
    // let li = createDOM()
    $("#searchResults").empty()
    $("#searchResults").append(li)
    console.log(li)
  })
  $("body").on("click", ".test", () => {

    console.log($(this).innerHTML)
    $($searchInput).val($(this).text()) 
    $("#searchResults").empty()
    
  })
  // $(".test").on("click", () => {
  //   console.log($(this).text())
  // })
})
