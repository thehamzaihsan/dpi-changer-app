import { changeDpiBlob } from "changedpi";

var imageUpload = document.querySelector("#image-upload");
const download = document.querySelector("#download");
const downloadall = document.querySelector("#downloadall");
const progress = document.querySelector("progress");
const dpiNumber = document.querySelector("#dpi-number");

var dpi = 300;

dpiNumber.addEventListener("change", function () {
  if (dpiNumber.value < 10 || dpiNumber.value > 1000) {
    alert("value not valid");
  } else {
    dpi = dpiNumber.value;
  }
  console.log(dpi);
});

imageUpload.addEventListener("change", function () {
  if (imageUpload.files.length > 1) {
    downloadall.style.display = "block";
  }

  progress.style.display = "block";
  const totalSize = Array.from(imageUpload.files).reduce(
    (acc, file) => acc + file.size,
    0
  );
  let loadedSize = 0;
  

  for (let index = 0; index < imageUpload.files.length; index++) {
    const file = imageUpload.files[index];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", function () {
      const image = new Image();
      image.src = reader.result;
      image.addEventListener("load", function () {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);

        canvas.toBlob(function (blob) {
          changeDpiBlob(blob, dpi).then(function (blob) {
            const link = document.createElement("a");

            link.href = URL.createObjectURL(blob);
            link.download = file.name;
            link.textContent = "Download " + file.name.replace(/\.[^/.]+$/, "");
            link.classList.add("link");
            const linkwrapper = document.createElement("div");
            const linkimg = document.createElement("img");
            linkimg.src = URL.createObjectURL(blob);
            linkwrapper.className = "linkwrapper";
            download.appendChild(linkwrapper);
            linkwrapper.appendChild(link);
            linkwrapper.appendChild(linkimg);

            loadedSize += file.size;
            progress.value = (loadedSize / totalSize) * 100;
          });
        });
      });
    });
  }
});

downloadall.addEventListener("click", function () {
  const links = download.querySelectorAll(".link");
  for (let i = 0; i < links.length; i++) {
    links[i].click();
  }
});
