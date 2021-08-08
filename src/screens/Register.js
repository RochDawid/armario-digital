import React from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from "react-native";
import Drop from "../components/Drop";
import { auth } from "../others/firebase";
import { useForm, Controller } from "react-hook-form";

export default function Register({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const register = (data) => {
    auth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then((authUser) => {
        authUser.user.updateProfile({ displayName: data.name }).then(() => {
          navigation.replace("Home");
        });
      })
      .catch(() =>
        alert(
          "Ocurrió un error, por favor comprueba que no exista una cuenta ya asociada al correo introducido y que los datos tengan el formato adecuado."
        )
      );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Drop />
        <Text style={styles.header}>Bienvenido a Armario Digital</Text>
        <Text style={styles.p}>
          Por favor, regístrate para disfrutar de la aplicación
        </Text>
        <View style={styles.inputs}>
          <View style={styles.input}>
            <Text style={styles.inputText}>Nombre*</Text>
            <Controller
              control={control}
              rules={{
                required: "¡No te olvides del nombre!",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.inputField}
                  value={value}
                  onChangeText={(na) => onChange(na)}
                  onBlur={onBlur}
                />
              )}
              name="name"
              defaultValue=""
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}
          </View>
          <View style={styles.input}>
            <Text style={styles.inputText}>Correo electrónico*</Text>
            <Controller
              control={control}
              rules={{
                required: "¡No te olvides del correo electrónico!",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.inputField}
                  onChangeText={(email) => onChange(email)}
                  onBlur={onBlur}
                  value={value}
                />
              )}
              name="email"
              defaultValue=""
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>
          <View style={styles.input}>
            <Text style={styles.inputText}>Contraseña*</Text>
            <Controller
              control={control}
              rules={{
                required: "¡No te olvides de la contraseña!",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.inputField}
                  secureTextEntry={true}
                  onBlur={onBlur}
                  value={value}
                  onChangeText={(pass) => onChange(pass)}
                />
              )}
              name="password"
              defaultValue=""
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>
        </View>
        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button
              title="Registrarse"
              color="#E9EDE9"
              onPress={handleSubmit(register)}
            />
          </View>
          <View style={styles.button2}>
            <Button
              title="Iniciar sesión"
              color="#1BB2EC"
              onPress={() => navigation.replace("Login")}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#202832" },
  header: {
    marginTop: 75,
    color: "#E9EDE9",
    fontWeight: "800",
    fontSize: 35,
    width: "85%",
    lineHeight: 50,
    paddingHorizontal: 25,
  },
  p: {
    marginTop: 70,
    color: "#E9EDE9",
    paddingHorizontal: 25,
    width: "60%",
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 110,
  },
  input: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 10,
  },
  inputText: {
    paddingLeft: 10,
    paddingBottom: 5,
    fontWeight: "500",
    color: "#E9EDE9",
  },
  inputField: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "#1BB2EC",
    padding: 10,
    color: "#E9EDE9",
  },
  button: {
    backgroundColor: "#1BB2EC",
    borderRadius: 25,
    padding: 5,
    marginTop: 25,
    width: 180,
  },
  button2: {
    borderWidth: 1,
    borderColor: "#1BB2EC",
    borderRadius: 25,
    padding: 5,
    marginTop: 10,
    width: 180,
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    paddingTop: 5,
    paddingLeft: 5,
    fontSize: 12,
  },
});
