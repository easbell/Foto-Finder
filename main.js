// VARIABLES

var searchInput = document.getElementById("search");
var searchBtn = document.getElementById("search-btn");

var titleInput = document.getElementById("title");
var captionInput = document.getElementById("caption");

var inputFile = document.getElementById("input-file");
var viewFavs = document.getElementById("fav");
var toAlbum = document.getElementById("add-to-album");

var photoGallery = document.querySelector('.images');
var imagesArr = JSON.parse(localStorage.getItem('photos')) || [];
var reader = new FileReader();


///////////////////////////////////////////////////////////
// EVENT LISTENERS
window.addEventListener('load', appendPhotos);
toAlbum.addEventListener('click', createElement);


///////////////////////////////////////////////////////////
// FUNCTIONS
function appendPhotos() {
  if (localStorage.hasOwnProperty('photos')) {
  imagesArr.forEach(function (element, index) {
    var newPhoto = new Photo(element.id, element.file, element.title, element.caption, element.favorite);
    addPhoto(element);
    imagesArr.push(newPhoto)
    });
  }
}

function createElement() {
  if (inputFile.files[0]) {
    reader.readAsDataURL(inputFile.files[0]); 
    reader.onload = addPhoto;
  }
}

function addPhoto(e) {
  console.log(e.target.result)
  var newPhoto = new Photo(Date.now(), e.target.result, titleInput.value, captionInput.value);
  photoGallery.insertAdjacentHTML('afterbegin',
    `<article class="card">
        <h4>${titleInput.value}</h4>
        <section class="card-img">
          <img class="uploaded-img" src=${e.target.result} />
        </section>
        <p>${captionInput.value}</p>
        <div class="card-foot">
          <img id="delete" src="assets/delete.svg">
          <img id="favorite" onclick="favorite();" src="assets/favorite.svg">
        </div>
      </article>`
      );
  imagesArr.push(newPhoto)
  newPhoto.saveToStorage(imagesArr)
}

//SWITCH FAVORITE BUTTON
function favorite() {
  var favorite = document.getElementById("favorite");
  if (favorite.src === "file:///Users/elizabethasbell/Turing/foto-finder/assets/favorite.svg") {
    favorite.src = "file:///Users/elizabethasbell/Turing/foto-finder/assets/favorite-active.svg";
    } else {
      favorite.src = "assets/favorite.svg";
    }
};
