import React, { useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { auth, storage } from "../others/firebase";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { uploadImageAsync } from "../others/photoHandler";
import Tab from "../components/Tab";
import Garment from "../components/Garment";

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
        backgroundColor: "#fff",
      }}
    >
      <ScrollView style={{ width: "100%" }}>
        <Garment
          navigation={navigation}
          garmentInfo={{ brand: "Nike", category: "Camiseta de manga corta", color: "Blanca", photo: "https://chemasport.es/22953-thickbox_default/camiseta-nike-sportswear-h-blanco.jpg" }}
        />
        <Garment
          navigation={navigation}
          garmentInfo={{ brand: "Primark", category: "Vaqueros", color: "Azul", photo: "http://primarkblog.com/wp-content/uploads/2015/01/Vaqueros-azules-b%C3%A1sicos-de-ni%C3%B1o.jpg" }}
        />
        <Garment
          navigation={navigation}
          garmentInfo={{ brand: "Air Jordan", category: "Zapatillas", color: "Azul", photo: "https://selectiveshops.com/wp-content/uploads/2020/05/Captura-de-pantalla-2020-05-17-a-las-18.34.01.png" }}
        />
        <Garment
          navigation={navigation}
          garmentInfo={{ last: true, brand: "Thrasher", category: "Sudadera con capucha", color: "Negro", photo: "https://cdn.skatespain.com/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/s/t/sthr015-sudadera-thrasher-bbq-black_1.jpg" }}
        />
      </ScrollView>
      <Tab navigation={navigation} />
    </View>
  );
}
