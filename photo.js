class Photo {
  constructor(id, file, title, caption, favorite) {
    this.id = id;
    this.file = file;
    this.title = title;
    this.caption = caption;
    this.favorite = favorite || false;
  }
  
  static saveToStorage(imagesArr) {
    localStorage.setItem('photos', JSON.stringify(imagesArr));
  }
  
  static deleteFromStorage(id) {
    imagesArr.forEach(function(image) {
      if (image.id === id) {
      imagesArr.splice(image, 1);
      }
      Photo.saveToStorage(imagesArr);
    });
  }

  static updatePhoto(id, type, newContent) {
    imagesArr.forEach(function(image) {
      if (image.id === id) {
        image[type] = newContent;
      }
      Photo.saveToStorage(imagesArr);
    });
  }
}