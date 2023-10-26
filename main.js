import { changeDpiBlob } from "changedpi";

var imageUpload = document.querySelector("#image-upload");
var link = document.querySelector("#link");

imageUpload.addEventListener("change" , function(){
  for (let index = 0; index < imageUpload.files.length; index++) {
    const file = imageUpload.files[index];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load" , function(){
      const image = new Image();
      image.src = reader.result;
      image.addEventListener("load" , function(){
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
    
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
    

        canvas.toBlob(
          function (blob) {


            
            changeDpiBlob(blob, 300).then(function (blob) {
              link.href = URL.createObjectURL(blob);
              link.download = file.name;
              
            });

            
          },
        );


      })
    })
  }
})

