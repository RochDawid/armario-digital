import { useState, useEffect } from "react";
import { auth, db, storage } from "./firebase";
import * as ImagePicker from "expo-image-picker";
import { uploadGarmentPhotoAsync } from "./photoHandler";

export default function useGarmentPhoto(navigation, route) {
  const [clothes, setClothes] = useState([]);
  const [pickerResult, setPickerResult] = useState();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (route) {
      setImage(route.params.photo);
    }
  }, []);

  const chooseImage = async (gallery) => {
    if (Platform.OS !== "web") {
      if (!gallery) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert(
            "Necesitamos que nos otorgues permisos para poder cambiar la foto😞"
          );
          return;
        }
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert(
            "Necesitamos que nos otorgues permisos para poder cambiar la foto😞"
          );
          return;
        }
      }
    }
    await pickImage(gallery);
    setShowModal(false);
  };

  const pickImage = async (gallery) => {
    let pickerResulted;
    const pickerOptions = {
      mediaTypes: "Images",
      quality: 0,
    };

    if (!gallery) {
      pickerResulted = await ImagePicker.launchCameraAsync(pickerOptions);
    } else {
      pickerResulted = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    }

    setImage(pickerResulted.uri);
    setPickerResult(pickerResulted);
  };

  const addGarment = async (data) => {
    try {
      setUploading(true);
      if (pickerResult && !pickerResult.cancelled) {
        const url = await uploadGarmentPhotoAsync(
          pickerResult.uri,
          auth.currentUser.displayName
        );
        db.collection("clothes").add({
          name: data.name,
          brand: data.brand,
          color: data.color,
          photoUrl: url,
          washing: data.washing,
          user: auth.currentUser.email,
        });
      }
    } catch (e) {
      console.log(e);
      alert(
        "La subida de tu prenda de ropa ha fallado 😞, por favor vuelve a intentarlo."
      );
    } finally {
      setUploading(false);
      navigation.goBack();
    }
  };

  const editGarment = async (data) => {
    try {
      setUploading(true);
      let url = route.params.photo;
      if (pickerResult) {
        url = await uploadGarmentPhotoAsync(
          pickerResult.uri,
          auth.currentUser.displayName
        );
        // delete old image from firebase storage
        storage.refFromURL(route.params.photo).delete();
      }
      await db
        .collection("clothes")
        .where("user", "==", auth.currentUser.email)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (
              doc.data().name == route.params.name &&
              doc.data().brand == route.params.brand &&
              doc.data().color == route.params.color &&
              doc.data().photoUrl == route.params.photo &&
              doc.data().washing == route.params.washing
            ) {
              db.collection("clothes").doc(doc.id).update({
                name: data.name,
                brand: data.brand,
                color: data.color,
                photoUrl: url,
                washing: data.washing,
              });
            }
          });
        });
    } catch (e) {
      console.log(e);
      alert(
        "La edición de tu prenda de ropa ha fallado 😞, por favor vuelve a intentarlo."
      );
    } finally {
      setUploading(false);
      navigation.goBack();
    }
  };

  const deleteGarment = async () => {
    try {
      storage.refFromURL(route.params.photo).delete();
      await db
        .collection("clothes")
        .where("user", "==", auth.currentUser.email)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (
              doc.data().name == route.params.name &&
              doc.data().brand == route.params.brand &&
              doc.data().color == route.params.color &&
              doc.data().photoUrl == route.params.photo &&
              doc.data().washing == route.params.washing
            ) {
              db.collection("clothes").doc(doc.id).delete();
            }
          });
        });
    } catch (e) {
      console.log(e);
      alert(
        "Eliminar tu prenda de ropa ha fallado 😞, por favor vuelve a intentarlo."
      );
    } finally {
      navigation.goBack();
    }
  };

  return {
    clothes,
    setClothes,
    loading,
    setLoading,
    image,
    uploading,
    showModal,
    setShowModal,
    chooseImage,
    addGarment,
    editGarment,
    deleteGarment,
  };
}
