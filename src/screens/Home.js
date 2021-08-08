import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  RefreshControl,
  Modal,
  StyleSheet,
} from "react-native";
import { auth, storage } from "../others/firebase";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { uploadImageAsync } from "../others/photoHandler";
import Tab from "../components/Tab";
import Garment from "../components/Garment";
import { getClothes } from "../others/garmentService";

export default function Home({ navigation }) {
  const [clothes, setClothes] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    updateClothes();
    getLatestImage();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Armario de ${auth?.currentUser?.displayName}`,
      headerStyle: {
        backgroundColor: "#2C3A58",
      },
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#E9EDE9",
      },
      gesturesEnabled: false,
      headerRight: () => (
        <TouchableOpacity onPress={() => logout()}>
          <Icon name="logout" color="#E9EDE9" style={{ marginRight: 20 }} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Modal visible={showModal} animated>
            <View style={{ backgroundColor: "#606060", flex: 1 }}>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.closeModalContainer}
                  onPress={() => setShowModal(false)}
                >
                  <Icon name="close" color="#E9EDE9" size={35} />
                </TouchableOpacity>
                <View style={{ alignSelf: "center", flexDirection: "column" }}>
                  <Text style={styles.modalText}>
                    ¿De dónde quieres sacar la foto?
                  </Text>
                  <View style={styles.chooseContainer}>
                    <TouchableOpacity
                      style={{ marginHorizontal: 10 }}
                      onPress={() => chooseImage(false)}
                    >
                      <Icon
                        name="camera"
                        color="#E9EDE9"
                        type="ionicon"
                        size={100}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ marginHorizontal: 10 }}
                      onPress={() => chooseImage(true)}
                    >
                      <Icon name="collections" color="#E9EDE9" size={100} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
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

  const updateClothes = async () => {
    setLoading(true);
    await getClothes().then((res) => {
      setClothes(res);
      setLoading(false);
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ width: "100%" }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={updateClothes}
            tintColor="#1BB2EC"
          />
        }
      >
        {clothes.map((garment, index) => (
          <Garment
            key={garment.photoUrl}
            navigation={navigation}
            last={index === clothes.length - 1}
            garmentInfo={{
              brand: garment.brand,
              color: garment.color,
              category: garment.category,
              photo: garment.photoUrl,
              washing: garment.washing,
            }}
          />
        ))}
      </ScrollView>
      <Tab navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#202832",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#1BB2EC",
    width: 300,
    height: 250,
    alignSelf: "center",
    top: 250,
  },
  closeModalContainer: { alignSelf: "flex-end", padding: 10 },
  modalText: {
    color: "#E9EDE9",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 10,
  },
  chooseContainer: {
    alignSelf: "center",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202832",
  },
});
