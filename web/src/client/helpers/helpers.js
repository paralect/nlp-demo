export const getFileDataUrl = (file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((res) => {
    reader.onloadend = () => {
      res(reader.result);
    };
  });
};

export const getFileByUrl = async (url) => {
  const fileName = url.split('/').pop();

  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => new File([blob], fileName));
};
