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



})
