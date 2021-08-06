import { storage } from "./firebase";

export const uploadImageAsync = async (uri, name) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.onerror = () => {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const photosRef = storage.ref().child("photos");
  const ref = photosRef.child(`${name}_photo`);
  const snapshot = await ref.put(blob);
  blob.close();

  return await snapshot.ref.getDownloadURL();
};

export const uploadGarmentPhotoAsync = async (uri, name) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.onerror = () => {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const garmentRef = storage.ref().child("photos").child("clothes").child(`${name}`);
  const photoId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  const ref = garmentRef.child(photoId);
  const snapshot = await ref.put(blob);
  blob.close();

  return await snapshot.ref.getDownloadURL();
};
