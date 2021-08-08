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
import { auth, db } from "../others/firebase";
import { useForm, Controller } from "react-hook-form";

export default function AddGarment({ navigation }) {
  const [pickerResult, setPickerResult] = useState();
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

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

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      if (pickerResult && !pickerResult.cancelled) {
        const url = await uploadGarmentPhotoAsync(
          pickerResult.uri,
          auth.currentUser.displayName
        );
        db.collection("clothes").add({
          category: data.category,
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

  return uploading ? (
    <View style={styles.uploadingContainer}>
      <ActivityIndicator color="#1BB2EC" animating size="large" />
      <Text style={{ color: "#E9EDE9" }}>
        Poniendo tu prenda en el armario...🕗
      </Text>
    </View>
  ) : (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => setShowModal(true)}
        >
          <Avatar
            rounded
            source={{
              uri:
                image ||
                "https://images.assetsdelivery.com/compings_v2/apoev/apoev1804/apoev180400145.jpg",
            }}
            style={styles.avatar}
          />
          <Text style={styles.addImageText}>Añadir imagen</Text>
        </TouchableOpacity>
        <Modal visible={showModal} animated>
          <View style={{ backgroundColor: "#606060", flex: 1 }}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeContainer}
                onPress={() => setShowModal(false)}
              >
                <Icon name="close" color="#E9EDE9" size={35} />
              </TouchableOpacity>
              <View style={styles.modalContainer2}>
                <Text style={styles.modalText}>
                  ¿De dónde quieres sacar la 📷?
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
        <View style={styles.inputContainer}>
          <Text style={styles.placeholder}>Nombre*</Text>
          <Controller
            control={control}
            rules={{
              required:
                "¡No seas tan vag@! Introduce el nombre de la prenda...",
              minLength: {
                value: 3,
                message: "¡Alegría! Pon al menos 3 carácteres...",
              },
              maxLength: {
                value: 20,
                message: "Tampoco te pases, con 20 carácteres vas sobrad@...",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(cat) => onChange(cat)}
              />
            )}
            name="category"
            defaultValue=""
          />
          {errors.category && (
            <Text style={styles.errorText}>{errors.category.message}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.placeholder}>Marca*</Text>
          <Controller
            control={control}
            rules={{
              required: "¡No seas tan vag@! Introduce la marca",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
              />
            )}
            name="brand"
            defaultValue=""
          />
          {errors.brand && (
            <Text style={styles.errorText}>{errors.brand.message}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.placeholder}>Color*</Text>
          <Controller
            control={control}
            rules={{
              required: "¡No seas tan vag@! Introduce el color",
              maxLength: {
                value: 20,
                message: "Tampoco te pases, con 20 carácteres vas sobrad@...",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
              />
            )}
            name="color"
            defaultValue=""
          />
          {errors.color && (
            <Text style={styles.errorText}>{errors.color.message}</Text>
          )}
        </View>
        <View style={styles.washingContainer}>
          <Text style={styles.washingText}>¿En la lavadora?</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Switch
                onValueChange={(value) => onChange(value)}
                value={value}
                onBlur={onBlur}
                thumbColor="#1BB2EC"
                trackColor={{ true: "#E9EDE9" }}
              />
            )}
            name="washing"
            defaultValue={false}
          />
        </View>
      </TouchableWithoutFeedback>
      <View>
        <TouchableOpacity
          style={styles.buttonsContainer}
          onPress={handleSubmit(onSubmit)}
        >
          <View style={styles.buttonsContainer2}>
            <Icon
              name="check"
              color="#E9EDE9"
              size={40}
              style={{ marginLeft: 5 }}
            />
            <Text style={styles.buttonText}>Añadir prenda</Text>
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
  uploadingContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202832",
  },
  container: { backgroundColor: "#202832", display: "flex", flex: 1 },
  avatarContainer: { marginBottom: 50, alignSelf: "center", marginTop: 50 },
  avatar: {
    height: 150,
    width: 150,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: "#1BB2EC",
  },
  addImageText: { alignSelf: "center", paddingTop: 5, color: "#E9EDE9" },
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
  closeContainer: { alignSelf: "flex-end", padding: 10 },
  modalContainer2: { alignSelf: "center", flexDirection: "column" },
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
  errorText: {
    color: "red",
    paddingTop: 5,
    paddingLeft: 5,
    fontSize: 12,
  },
  washingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 25,
  },
  washingText: { color: "#E9EDE9", paddingRight: 10 },
  buttonsContainer: {
    alignSelf: "center",
    backgroundColor: "#1BB2EC",
    borderRadius: 25,
    marginTop: 50,
  },
  buttonsContainer2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  buttonText: {
    color: "#E9EDE9",
    marginHorizontal: 10,
    fontWeight: "500",
  },
});
