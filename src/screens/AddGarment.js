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
        Añadiendo tu prenda al armario...
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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.inputContainer}>
          <Text style={styles.placeholder}>Nombre*</Text>
          <Controller
            control={control}
            rules={{
              required: "Introduce tu nombre",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 carácteres",
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
            <Text
              style={{
                color: "red",
                paddingTop: 5,
                paddingLeft: 5,
                fontSize: 12,
              }}
            >
              {errors.category.message}
            </Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.placeholder}>Marca*</Text>
          <Controller
            control={control}
            rules={{
              required: "Introduce la marca",
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
            <Text
              style={{
                color: "red",
                paddingTop: 5,
                paddingLeft: 5,
                fontSize: 12,
              }}
            >
              {errors.brand.message}
            </Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.placeholder}>Color*</Text>
          <Controller
            control={control}
            rules={{
              required: "Introduce el color",
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
            <Text
              style={{
                color: "red",
                paddingTop: 5,
                paddingLeft: 5,
                fontSize: 12,
              }}
            >
              {errors.color.message}
            </Text>
          )}
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
          <Controller
            control={control}
            rules={{
              required: "Introduce la marca",
            }}
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
            defaultValue=""
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
          onPress={handleSubmit(onSubmit)}
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
              Añadir prenda
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
