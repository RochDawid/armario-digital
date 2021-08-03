import React, { useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { auth, storage } from "../others/firebase";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { uploadImageAsync } from "../others/photoHandler";

export default function Home({ navigation }) {
  const logout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch(() =>
        alert(
          "Algo ha fallado intentando cerrar tu sesión, parece que no queremos que te vayas..."
        )
      );
  };

  const pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: "Images",
    });

    handleImagePicked(pickerResult);
  };

  const getLatestImage = () => {
    storage
      .ref()
      .child(`photos/${auth?.currentUser?.displayName}_photo`)
      .getDownloadURL()
      .then((url) => {
        setImage(url);
      })
      .catch((err) => console.log(err));
  };

  const handleImagePicked = async (pickerResult) => {
    try {
      setUploading(true);
      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(
          pickerResult.uri,
          auth.currentUser.displayName
        );
        setImage(uploadUrl);
      }
    } catch (e) {
      alert("La subida de tu imagen ha fallado disculpa :(");
    } finally {
      setUploading(false);
    }
  };

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
    pickImage();
  };

  useLayoutEffect(() => {
    getLatestImage();
    navigation.setOptions({
      headerTitle: `Armario de ${auth?.currentUser?.displayName}`,
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
      <ActivityIndicator color="white" animating size="large" />
      <Text style={{ color: "white" }}>Subiendo tu imagen a la nube...</Text>
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
