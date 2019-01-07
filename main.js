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

// window.addEventListener('load', noPhotos);

toAlbum.addEventListener('click', createElement);

photoGallery.addEventListener('click', deleteCard);

photoGallery.addEventListener('dblclick', multiEvents);

photoGallery.addEventListener('click', favorite);

window.addEventListener('input', enableButton);

///////////////////////////////////////////////////////////
// FUNCTIONS

//APPEND PHOTOS ON RELOAD
function appendPhotos() {
  imagesArr.forEach(function (photo) {
    photoGallery.insertAdjacentHTML('afterbegin',
    `<article data-id=${photo.id} class="card">
        <h4 class="photo-title">${photo.title}</h4>
        <section class="card-img">
          <img class="uploaded-img" src=${photo.file} />
        </section>
        <p class="photo-caption">${photo.caption}</p>
        <div class="card-foot">
          <img class="delete" src="assets/delete.svg">
          <img class="favorite" src=${photo.favorite ? "assets/favorite-active.svg" : "assets/favorite.svg"}>
        </div>
      </article>`);
  });
}

//CREATE IMAGE STRING
function createElement(e) {
  if (inputFile.files[0]) {
    reader.readAsDataURL(inputFile.files[0]); 
    reader.onload = addPhoto
  }
}

//CREATE INITIAL PHOTO
function addPhoto(e) {
  var id = Date.now()
  var newPhoto = new Photo(id, e.target.result, titleInput.value, captionInput.value);
  photoGallery.insertAdjacentHTML('afterbegin',
    `<article data-id=${id} class="card">
        <h4 class="photo-title">${titleInput.value}</h4>
        <section class="card-img">
          <img class="uploaded-img" src=${e.target.result} />
        </section>
        <p class="photo-caption">${captionInput.value}</p>
        <div class="card-foot">
          <img class="delete" src="assets/delete.svg">
          <img class="favorite" src="assets/favorite.svg">
        </div>
      </article>`
      );
  imagesArr.push(newPhoto)
  Photo.saveToStorage(imagesArr)
}

//CHECKING FOR BOTH EVENTS
function multiEvents(e) {
  e.target.contentEditable = true; 
  document.body.addEventListener('keypress', function(e) {
    var key = e.keyCode;
    if (key === 13) {
      e.target.blur();
      editCard(e);
    }
  });
  document.body.addEventListener('focusout', function(e) {
    editCard(e);
  });
}

//NO PHOTOS
// function noPhotos() {
//   if (imagesArr.length === 0) {
//     photoGallery.classList.remove("bottom");
//     photoGallery.classList.add("no-images");
//     photoGallery.innerHTML = '<h2>Please add photos...</h2>';
//   }
// }
//NOT PERFECT, NEED TO ADJUST FOR WHEN AN IMAGE IS ADDED

//DISABLED BUTTON
function enableButton() {
  var parsedTitle = parseInt(titleInput.value.length);
  var parsedCaption = parseInt(captionInput.value.length);
  if ((parsedTitle >= 1 || parsedCaption >=1) && (inputFile.files.length >= 1)) {
    toAlbum.disabled = false;
  } else if (parsedTitle === 0 && parsedCaption === 0) {
    toAlbum.disabled = true;
  }
}

// EDIT CARD
function editCard(e) {
  var cardId = parseInt(e.target.parentElement.dataset.id);
  if (e.target.className === "photo-title") {
    Photo.updatePhoto(cardId, "title", e.target.innerText);
  } else if (e.target.classList.contains("photo-caption")) {
    Photo.updatePhoto(cardId, "caption", e.target.innerText);
  }
  e.target.contentEditable = false; 
}

//DELETE CARD
function deleteCard(e){
  var cardId = parseInt(e.target.parentElement.parentElement.dataset.id);
  if (e.target.className === "delete") {
    e.target.parentElement.parentElement.remove();
    Photo.deleteFromStorage(cardId);
  }
}

//SWITCH FAVORITE BUTTON
function favorite(e) {
  if (e.target.className === "favorite") {
    var cardId = parseInt(e.target.parentElement.parentElement.dataset.id);
    if (event.target.attributes.src.textContent === "assets/favorite.svg") {
    event.target.attributes.src.textContent = "assets/favorite-active.svg";
    Photo.updatePhoto(cardId, "favorite", true)
  } else { 
    event.target.attributes.src.textContent = "assets/favorite.svg";
    Photo.updatePhoto(cardId, "favorite", false)
    }
  }
}