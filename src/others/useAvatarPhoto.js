import { useState } from "react";
import { auth, storage } from "./firebase";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImageAsync } from "./photoHandler";

export default function useAvatarPhoto() {
  const [image, setImage] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    uploadImageAsync(pickerResulted.uri, auth.currentUser.displayName);
  };

  const getLatestImage = async () => {
    await storage
      .ref()
      .child(`photos/${auth?.currentUser?.displayName}_photo`)
      .getDownloadURL()
      .then((url) => {
        setImage(url);
      })
      .catch((err) => console.log(err));
  };

  return { image, showModal, setShowModal, chooseImage, getLatestImage };
}
