import React, {useState, useRef} from "react";
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, ScrollView, ImageBackground, Image, KeyboardAvoidingView, Keyboard } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { TopNavigation } from "../../components/TopNavigation.component";
import Input from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import FireMethods from "../../lib/methods.firebase";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";

const { width } = Dimensions.get("window");
const cover = require("../../assets/images/background.jpg");
const profilePic = require("../../assets/images/female-2.jpg");
const watchPic = require("../../assets/images/male-2.jpg");

export const Salida2Screen = (props) => {
  const [activeTab, setActiveTab] = useState("0");
  const [buscar, setBuscar] = useState("");
  const [messageText, setMessageText] = useState("");
  const [person, setPerson] = useState(null);
  const [horaSalida, setHoraSalida] = useState();

  const searchRef = useRef()

  const getHour = () => {
    let hour = moment().format("MMM D, h:mm");
    setHoraSalida(hour);
    return hour;
  };

  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const buscarProfile = async (id) => {
    setMessageText("");
    setPerson(null);
    let resp;
    await FireMethods.getDuplicateDni(id, (data) => {
      resp = data;
    });
    console.log("resp", resp);

    if (resp.data != null) {
      setPerson(resp.data);

    } else {
      setMessageText(resp.msg);
    }
    Keyboard.dismiss();
  };

  const update = () => {
    console.log("person:  ", person);
    FireMethods.updateEntrance(person.timeStamp, getHour());
  };

  const MessageView = (props) => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>{props.message}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Salida" leftControl={goBackAction()} />
      <View style={styles.searchBox}>
        <View style={{ width: "70%" }}>
          <Input 
          title="Buscar por DNI" 
          shape="round" 
          alignText="center" 
          style={{ backgroundColor: "white" }} 
          retrunKeyType="search"
          onSubmitEditing={() => buscarProfile()}
          onChangeText={(valor) => setBuscar(valor)} 
          value={buscar} />
        </View>
        <TouchableOpacity onPress={() => buscarProfile(buscar)}>
          <Ionicons name="ios-search" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {person != null ? (
        <View style={{ flex: 1 }}>
          <ImageBackground source={cover} style={styles.imgBackground}>
            <View style={styles.cover}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {/* <Ionicons name="ios-person" size={120} color="#fff" /> */}
                <View style={{ position: "relative", marginBottom: 10 }}>
                  <Image source={{ uri: person.foto }} style={styles.profilePic} />
                </View>
                <View style={styles.nameBox}>
                  <Text style={styles.nameText}>
                    {person.nombre} {person.apellido}
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={{ width: "75%" }}>
              <View style={styles.dataBox}>
                <Text style={styles.labelText}>DNI:</Text>
                <Text style={styles.dataText}>{person.cedula}</Text>
              </View>
              <View style={styles.dataBox}>
                <Text style={styles.labelText}>Destino:</Text>
                <Text style={styles.dataText}>{person.destino}</Text>
              </View>
              <View style={styles.dataBox}>
                <Text style={styles.labelText}>Hora de Entrada:</Text>
                <Text style={styles.dataText}>{person.hora_entrada}</Text>
              </View>
              <View style={styles.dataBox}>
                <Text style={styles.labelText}>Hora de Salida:</Text>
                <Text style={styles.dataText}>{horaSalida}</Text>
              </View>
              <View>
                <MainButton
                  title="Marcar salida"
                  onPress={() => {
                    update();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      ) : (
        <MessageView message={messageText} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imgBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  searchBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingBottom: 5,
    alignItems: "center",
    backgroundColor: "#ff7e00",
  },
  cover: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    opacity: 0.8,
    justifyContent: "center",
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
  },
  nameBox: {
    height: 40,
    //backgroundColor: "orange",
    paddingHorizontal: 10,
    borderRadius: 20,
    top: "10%",
    justifyContent: "center",
  },
  nameText: {
    textAlign: "center",
    fontSize: 32,
    color: "#fff",
  },

  //elemento 1
  dataBox: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    //width:'75%'
    //justifyContent:'space-between'
  },
  labelText: {
    fontSize: 14,
    color: "grey",
  },
  dataText: {
    fontSize: 17,
    //fontWeight:'200',
    paddingLeft: 20,
  },
  //emento 2
});
