class Photo {
  constructor(id, file, title, caption, favorite) {
    this.id = id;
    this.file = file;
    this.title = title;
    this.caption = caption;
    this.favorite = false;
  }
  
  saveToStorage(imagesArr) {
    localStorage.setItem('photos', JSON.stringify(imagesArr));
  }
  
  deleteFromStorage() {

  }

  updatePhoto() {
    
  }
}