import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import * as ImagePicker from "expo-image-picker";
import { uploadGarmentPhotoAsync } from "../others/photoHandler";
import { Avatar } from "react-native-elements";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { auth, db } from "../others/firebase";

export default function AddGarment() {
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pickerResult, setPickerResult] = useState();

  const chooseImage = async () => {
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

  const pickImage = async () => {
    let pickerResulted = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: "Images",
    });

    setImage(pickerResulted.uri);
    setPickerResult(pickerResulted);
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      if (!pickerResult.cancelled) {
        const url = await uploadGarmentPhotoAsync(
          pickerResult.uri,
          auth.currentUser.displayName
        );
        db.collection("clothes")
          .add({ category, brand, color, photoUrl: url, user: auth.currentUser.email });
      }
    } catch (e) {
      console.log(e);
      alert(
        "La subida de tu prenda de ropa ha fallado 😞, por favor vuelve a intentarlo."
      );
    } finally {
      setUploading(false);
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
      <Text style={{ color: "white" }}>Subiendo tu imagen a la nube...</Text>
    </View>
  ) : (
    <View>
      <TouchableOpacity
        style={{ marginBottom: 50, alignSelf: "center", marginTop: 50 }}
        onPress={() => chooseImage()}
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
            borderColor: "#3498db",
          }}
        />
        <Text style={{ alignSelf: "center", paddingTop: 5 }}>
          Añadir imagen
        </Text>
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.inputContainer}>
          <Text style={styles.placeholder}>Tipo de prenda</Text>
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
            backgroundColor: "#3498db",
            borderRadius: 10,
            marginTop: 50,
            alignSelf: "center",
          }}
          onPress={() => handleSubmit()}
        >
          <Icon name="check" color="#fff" size={100} />
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
    borderColor: "#3498db",
    borderRadius: 25,
    height: 40,
    padding: 10,
  },
  placeholder: {
    paddingBottom: 5,
  },
});
