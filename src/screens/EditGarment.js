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
} from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import * as ImagePicker from "expo-image-picker";
import { uploadGarmentPhotoAsync } from "../others/photoHandler";
import { Avatar } from "react-native-elements";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { auth, db, storage } from "../others/firebase";

export default function EditGarment({ route, navigation }) {
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(route.params.photo);
  const [category, setCategory] = useState(route.params.category);
  const [brand, setBrand] = useState(route.params.brand);
  const [color, setColor] = useState(route.params.color);
  const [pickerResult, setPickerResult] = useState();

  const categoryOld = route.params.category;
  const imageOld = route.params.photo;
  const brandOld = route.params.brand;
  const colorOld = route.params.color;

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
        // delete old image
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
              db.collection("clothes")
                .doc(doc.id)
                .update({ category, brand, color, photoUrl: url });
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

  return uploading ? (
    <View
      style={{
        display: "flex",
        flex: "1",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightgray",
      }}
    >
      <ActivityIndicator color="white" animating size="large" />
      <Text style={{ color: "white" }}>Cambiando tu prenda del armario...</Text>
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
            height: 100,
            width: 100,
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
      </TouchableWithoutFeedback>
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: "#1BB2EC",
            borderRadius: 25,
            marginTop: 50,
            alignSelf: "center",
          }}
          onPress={() => handleSubmit()}
        >
          <Icon name="check" color="#E9EDE9" size={80} />
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
