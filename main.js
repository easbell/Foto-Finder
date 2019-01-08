///////////////////////////////////////////////////////////
// VARIABLES

var searchInput = document.getElementById("search");
var searchBtn = document.getElementById("search-btn");
var titleInput = document.getElementById("title");
var captionInput = document.getElementById("caption");
var inputFile = document.getElementById("input-file");
var viewFavs = document.getElementById("fav");
var toAlbum = document.getElementById("add-to-album");
var photoGallery = document.querySelector('.bottom');
var showBtn = document.getElementById("show-more");
var favBtn = document.getElementById("fav");
var imagesArr = JSON.parse(localStorage.getItem('photos')) || [];
var filteredFavs = [];
var reader = new FileReader();


///////////////////////////////////////////////////////////
// EVENT LISTENERS

window.addEventListener('load', noPhotos);
showBtn.addEventListener('click', showMore);
favBtn.addEventListener('click', showFavs)
toAlbum.addEventListener('click', createElement);
searchInput.addEventListener('input', searchFunction);
photoGallery.addEventListener('click', deleteCard);
photoGallery.addEventListener('dblclick', multiEvents);
photoGallery.addEventListener('click', favorite);
titleInput.addEventListener('input', enableButton);
inputFile.addEventListener('change', enableButton);
searchInput.addEventListener('input', detectSearchType);

///////////////////////////////////////////////////////////
// FUNCTIONS

function appendPhotos(array) {
  photoGallery.innerHTML = "";
  array.forEach(function(photo) {
    addPhoto(photo);
  });
}

function showTen() {
  var shortArray = imagesArr.slice(-10);
  appendPhotos(shortArray);
  favCounter();
}

function createElement(e) {
  if (inputFile.files[0]) {
    reader.readAsDataURL(inputFile.files[0]); 
    reader.onload = initialPhoto;
  }
}

function clearFields() {
  titleInput.value = "";
  captionInput.value = "";
  inputFile.value = "";
}

function initialPhoto(e) {
  var newPhoto = new Photo(Date.now(), e.target.result, titleInput.value, captionInput.value);
  imagesArr.push(newPhoto);
  Photo.saveToStorage(imagesArr);
  addPhoto(newPhoto);
  noPhotos();
  clearFields();
  enableButton();
}

function addPhoto(photo) {
  photoGallery.insertAdjacentHTML('afterbegin',
    `<article data-id=${photo.id} class="card">
      <h4 class="photo-title">${photo.title}</h4>
      <section class="card-img">
        <img class="uploaded-img" src=${photo.file} />
      </section>
      <p class="photo-caption">${photo.caption}</p>
      <div class="card-foot">
        <button class="delete"></button>
        <img alt="favorite button" class="favorite" src=${photo.favorite ? "assets/favorite-active.svg" : "assets/favorite.svg"}>
      </div>
    </article>`);
}

function detectSearchType() {
  if (favBtn.innerText === "Show All Photos") {
    arrayToSearch = filteredFavs;
  } else {
    arrayToSearch = imagesArr;
  } searchFunction(arrayToSearch);
}

function searchFunction(arr) {
  var toFind = searchInput.value.toLowerCase();
  var filteredPhotos = arr.filter(function(element) {
    return element.title.toLowerCase().includes(toFind) || element.caption.toLowerCase().includes(toFind);
  });
  appendPhotos(filteredPhotos);
}

function showFavs() {
  filteredFavs = imagesArr.filter(function(photo) {
      return photo.favorite === true;
    });
  if (favBtn.innerText.includes("View")) {
    showBtn.disabled = true;
    favBtn.innerText = "Show All Photos";
    appendPhotos(filteredFavs);
  } else if (favBtn.innerText.includes("Show")) {
    showBtn.disabled = false;
    favCounter(), appendPhotos(imagesArr);
  };
}

function favCounter() {
  var amount = 0;
  imagesArr.forEach(function(photo) {
    if(photo.favorite === true) {
      amount++;
    }
  });
  favBtn.innerText = `View ${amount} Favorites`;
}

function showMore() {
  if (showBtn.innerText === "Show More") {
    appendPhotos(imagesArr);
    showBtn.innerText = "Show Less";
  } else if (showBtn.innerText === "Show Less") {
    showTen();
    showBtn.innerText = "Show More"
  }
}

function noPhotos() {
  if (imagesArr.length === 0) {
    photoGallery.classList.replace("bottom", "no-images");
    photoGallery.innerHTML = '<h2>Please add photos...</h2>';
  } else if (imagesArr.length >= 1) {
    photoGallery.classList.replace("no-images", "bottom");
    showTen();
  }
}

function multiEvents(e) {
  e.target.contentEditable = true; 
  document.body.addEventListener('keypress', function(e) {
    if (e.keyCode === 13) {
      editCard(e); 
  }});
  document.body.addEventListener('focusout', function(e) {
    editCard(e);
  });
}

function editCard(e) {
  var cardId = parseInt(e.target.parentElement.dataset.id);
  if (e.target.className === "photo-title") {
    Photo.updatePhoto(cardId, "title", e.target.innerText);
  } else if (e.target.className === "photo-caption") {
    Photo.updatePhoto(cardId, "caption", e.target.innerText);
  }
  e.target.contentEditable = false; 
}

function deleteCard(e){
  var cardId = parseInt(e.target.parentElement.parentElement.dataset.id);
  if (e.target.className === "delete") {
    e.target.parentElement.parentElement.remove();
    Photo.deleteFromStorage(cardId);
  }
}

function favorite(e) {
  if (e.target.className === "favorite") {
    var cardId = parseInt(e.target.parentElement.parentElement.dataset.id);
    if (event.target.attributes.src.textContent === "assets/favorite.svg") {
    event.target.attributes.src.textContent = "assets/favorite-active.svg";
    Photo.updatePhoto(cardId, "favorite", true)
  } else { 
    event.target.attributes.src.textContent = "assets/favorite.svg";
    Photo.updatePhoto(cardId, "favorite", false)
  }} favCounter();
}

function enableButton() {
  var titleLength = titleInput.value.length;
  titleLength && inputFile.files.length ? toAlbum.disabled = false : toAlbum.disabled = true;
}