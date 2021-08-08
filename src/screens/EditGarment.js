import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Modal,
  Switch,
} from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { Avatar } from "react-native-elements";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useForm, Controller } from "react-hook-form";
import useGarmentPhoto from "../others/useGarmentPhoto";
import Uploading from "../components/Uploading";

export default function EditGarment({ route, navigation }) {
  const {
    image,
    uploading,
    showModal,
    setShowModal,
    chooseImage,
    editGarment,
    deleteGarment,
  } = useGarmentPhoto(navigation, route);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  return uploading ? (
    <Uploading />
  ) : (
    <View style={styles.container}>
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
        <Text style={styles.addImageText}>Cambiar imagen</Text>
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
        <View style={styles.inputsContainer}>
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
              defaultValue={route.params.category}
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
              defaultValue={route.params.brand}
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
              defaultValue={route.params.color}
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
              defaultValue={route.params.washing}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View>
        <TouchableOpacity
          style={styles.buttonsContainer}
          onPress={handleSubmit(editGarment)}
        >
          <View style={styles.buttonsContainer2}>
            <Icon
              name="check"
              color="#E9EDE9"
              size={40}
              style={{ marginLeft: 5 }}
            />
            <Text style={styles.buttonText}>Actualizar prenda</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteGarmentContainer}
          onPress={deleteGarment}
        >
          <View style={styles.buttonsContainer2}>
            <Icon
              name="delete"
              color="#ff0000"
              size={40}
              style={{ marginLeft: 5 }}
            />
            <Text style={styles.deleteText}>Eliminar prenda</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputsContainer: {
    paddingTop: 40,
  },
  inputContainer: {
    width: "70%",
    alignSelf: "center",
    paddingVertical: 10,
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
  container: {
    backgroundColor: "#202832",
    display: "flex",
    flex: 1,
    paddingTop: 50,
  },
  avatarContainer: { alignSelf: "center", zIndex: 1 },
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
  deleteGarmentContainer: {
    alignSelf: "center",
    backgroundColor: "#202832",
    borderRadius: 25,
    marginTop: 15,
    borderColor: "#ff0000",
    borderWidth: 1,
  },
  deleteText: {
    color: "#ff0000",
    marginHorizontal: 10,
    fontWeight: "500",
  },
});
