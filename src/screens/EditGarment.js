import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Modal,
  Switch,
} from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import * as ImagePicker from "expo-image-picker";
import { uploadGarmentPhotoAsync } from "../others/photoHandler";
import { Avatar } from "react-native-elements";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { auth, db, storage } from "../others/firebase";

export default function EditGarment({ route, navigation }) {
  const [pickerResult, setPickerResult] = useState();
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [washing, setWashing] = useState(route.params.washing);
  const [image, setImage] = useState(route.params.photo);
  const [category, setCategory] = useState(route.params.category);
  const [brand, setBrand] = useState(route.params.brand);
  const [color, setColor] = useState(route.params.color);

  const categoryOld = route.params.category;
  const imageOld = route.params.photo;
  const brandOld = route.params.brand;
  const colorOld = route.params.color;
  const washingOld = route.params.washing;

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
      allowsEditing: true,
      mediaTypes: "Images",
    };

    if (!gallery) {
      pickerResulted = await ImagePicker.launchCameraAsync(pickerOptions);
    } else {
      pickerResulted = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    }

    setImage(pickerResulted.uri);
    setPickerResult(pickerResulted);
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      let url = imageOld;
      if (pickerResult) {
        url = await uploadGarmentPhotoAsync(
          pickerResult.uri,
          auth.currentUser.displayName
        );
        // delete old image from firebase storage
        storage.refFromURL(imageOld).delete();
      }
      await db
        .collection("clothes")
        .where("user", "==", auth.currentUser.email)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (
              doc.data().category == categoryOld &&
              doc.data().brand == brandOld &&
              doc.data().color == colorOld &&
              doc.data().photoUrl == imageOld &&
              doc.data().washing == washingOld
            ) {
              db.collection("clothes")
                .doc(doc.id)
                .update({ category, brand, color, photoUrl: url, washing });
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
      navigation.replace("Home");
    }
  };

  const deleteGarment = async () => {
    try {
      let url = imageOld;
      if (pickerResult) {
        url = await uploadGarmentPhotoAsync(
          pickerResult.uri,
          auth.currentUser.displayName
        );
        // delete old image from firebase storage
        storage.refFromURL(imageOld).delete();
      }
      await db
        .collection("clothes")
        .where("user", "==", auth.currentUser.email)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (
              doc.data().category == categoryOld &&
              doc.data().brand == brandOld &&
              doc.data().color == colorOld &&
              doc.data().photoUrl == imageOld
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
      navigation.replace("Home");
    }
  };

  return uploading ? (
    <View
      style={{
        display: "flex",
        flex: "1",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#202832",
      }}
    >
      <ActivityIndicator color="#1BB2EC" animating size="large" />
      <Text style={{ color: "#E9EDE9" }}>
        Cambiando tu prenda del armario...
      </Text>
    </View>
  ) : (
    <View style={{ backgroundColor: "#202832", display: "flex", flex: 1 }}>
      <TouchableOpacity
        style={{ marginBottom: 50, alignSelf: "center", marginTop: 50 }}
        onPress={() => setShowModal(true)}
      >
        <Avatar
          rounded
          source={{
            uri:
              image ||
              "https://images.assetsdelivery.com/compings_v2/apoev/apoev1804/apoev180400145.jpg",
          }}
          style={{
            height: 150,
            width: 150,
            borderWidth: 1,
            borderRadius: 18,
            borderColor: "#1BB2EC",
          }}
        />
        <Text style={{ alignSelf: "center", paddingTop: 5, color: "#E9EDE9" }}>
          Añadir imagen
        </Text>
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Modal visible={showModal} animated>
          <View style={{ backgroundColor: "#606060", flex: 1 }}>
            <View
              style={{
                display: "block",
                backgroundColor: "#202832",
                borderRadius: 15,
                borderWidth: 3,
                borderColor: "#1BB2EC",
                width: 300,
                height: 250,
                alignSelf: "center",
                top: 250,
                opacity: 1,
              }}
            >
              <TouchableOpacity
                style={{ alignSelf: "flex-end", padding: 10 }}
                onPress={() => setShowModal(false)}
              >
                <Icon name="close" color="#E9EDE9" size={35} />
              </TouchableOpacity>
              <View style={{ alignSelf: "center", flexDirection: "column" }}>
                <Text
                  style={{
                    color: "#E9EDE9",
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: 30,
                    marginTop: 10,
                  }}
                >
                  ¿De dónde quieres sacar la foto?
                </Text>
                <View
                  style={{
                    alignSelf: "center",
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
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
        <View style={styles.inputContainer}>
          <Text style={styles.placeholder}>Nombre</Text>
          <TextInput
            style={styles.input}
            defaultValue={category}
            onChangeText={(cat) => setCategory(cat)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.placeholder}>Marca</Text>
          <TextInput
            style={styles.input}
            defaultValue={brand}
            onChangeText={(bra) => setBrand(bra)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.placeholder}>Color</Text>
          <TextInput
            style={styles.input}
            defaultValue={color}
            onChangeText={(col) => setColor(col)}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 25,
          }}
        >
          <Text style={{ color: "#E9EDE9", paddingRight: 10 }}>
            ¿En la lavadora?
          </Text>
          <Switch
            onValueChange={(value) => setWashing(value)}
            value={washing}
            thumbColor="#1BB2EC"
            trackColor={{ true: "#E9EDE9" }}
          />
        </View>
      </TouchableWithoutFeedback>
      <View>
        <TouchableOpacity
          style={{
            alignSelf: "center",
            backgroundColor: "#1BB2EC",
            borderRadius: 25,
            marginTop: 50,
          }}
          onPress={() => handleSubmit()}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Icon
              name="check"
              color="#E9EDE9"
              size={40}
              style={{ marginLeft: 5 }}
            />
            <Text
              style={{
                color: "#E9EDE9",
                marginHorizontal: 10,
                fontWeight: "500",
              }}
            >
              Actualizar prenda
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignSelf: "center",
            backgroundColor: "#202832",
            borderRadius: 25,
            marginTop: 15,
            borderColor: "#ff0000",
            borderWidth: 1,
          }}
          onPress={() => deleteGarment()}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Icon
              name="delete"
              color="#ff0000"
              size={40}
              style={{ marginLeft: 5 }}
            />
            <Text
              style={{
                color: "#ff0000",
                marginHorizontal: 10,
                fontWeight: "500",
              }}
            >
              Eliminar prenda
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "70%",
    alignSelf: "center",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#1BB2EC",
    borderRadius: 25,
    height: 40,
    padding: 10,
    color: "#E9EDE9",
  },
  placeholder: {
    paddingBottom: 5,
    paddingLeft: 5,
    color: "#E9EDE9",
  },
});
