import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { auth, storage } from "../others/firebase";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "react-native-elements/dist/icons/Icon";

export default function Home({ navigation }) {
  const logout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((err) => console.log(err));
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: "Images",
    });

    _handleImagePicked(pickerResult);
  };

  const getLatestImage = () => {
    storage
      .ref()
      .child(`photos/${auth.currentUser.displayName}_photo`)
      .getDownloadURL()
      .then((url) => {
        setImage(url);
      })
      .catch((error) => alert(error));
  };

  _handleImagePicked = async (pickerResult) => {
    try {
      setUploading(true);
      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        setImage(uploadUrl);
      }
    } catch (e) {
      alert("La subida de tu imagen ha fallado disculpa :(");
      console.log(e);
    } finally {
      setUploading(false);
    }
  };

  async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const photosRef = storage.ref().child("photos");
    const ref = photosRef.child(`${auth.currentUser.displayName}_photo`);
    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  const changeAvatar = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(
          "Necesitamos que nos otorgues permisos para poder modificar tu foto de perfil"
        );
        return;
      }
    }
    _pickImage();
  };

  useLayoutEffect(() => {
    getLatestImage();
    navigation.setOptions({
      headerTitle: `Armario de ${auth.currentUser.displayName}`,
      headerStyle: {
        backgroundColor: "#3498db",
      },
      headerTintColor: "white",
      headerTitleStyle: {
        fontWeight: "bold",
        color: "white",
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => logout()}>
          <Icon name="logout" color="white" style={{ marginRight: 20 }} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => changeAvatar()}>
          <View style={{ marginLeft: 20 }}>
            <Avatar
              rounded
              source={{
                uri:
                  image ||
                  "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper.png",
              }}
            />
          </View>
        </TouchableOpacity>
      ),
    });
  });

  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  return uploading ? (
    <View
      style={{
        display: "flex",
        flex: "1",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "gray",
      }}
    >
      <ActivityIndicator
        color="white"
        animating
        size="large"
      />
      <Text style={{ color: 'white' }}>Subiendo tu imagen a la nube...</Text>
    </View>
  ) : (
    <View
      style={{
        display: "flex",
        flex: "1",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>Tu ropa</Text>
    </View>
  );
}
