import React from "react";
import { View, Text, StyleSheet, Image, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Input } from "../../components/input.component";

export const PerfilScreen = (props) => {
  const [textChange, setTextChange] = React.useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const goBackAction = () => {
    return (
      <RectButton
        onPress={() => {
          props.navigation.goBack();
        }}
      >
        <Ionicons name="ios-arrow-back" size={28} color="white" />
      </RectButton>
    );
  };

  return (
    <View>
      <TopNavigation title="Perfil" leftControl={goBackAction()} />
      <View style={styles.perfilContainer}>
        <Image
          style={styles.perfilLogo}
          source={require("../../assets/images/security-logo.png")}
        />
        <Text>Security. All Right Reserved</Text>
        <View style={styles.editBox}>
          <Text>Cambio de Contraseña</Text>
          <Input
            title="Clave"
            alignText="center"
            shape="round"
            secureTextEntry={true}
            onChangeText={(text) => {
              setTextChange(text);
            }}
            value={textChange}
          />
          {(textChange != "") ? 
            <Input
              title="Repetir Clave"
              alignText="center"
              secureTextEntry={true}
              shape="round"
              onChangeText={(text) => {
                setRepeatPass(text);
              }}
              value={repeatPass}
            />
           : null}
          {(repeatPass != "") ? <MainButton title="Guardar Cambios" /> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  perfilContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  perfilLogo: {
    width: 120,
    height: 120,
  },
  editBox: {
    marginTop: 30,
    width: "75%",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "grey",
  },
});
