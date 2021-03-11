import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import Input from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import axios from "axios";
import { Picker } from "@react-native-community/picker";
import { API_PORT } from "../../config/index";
import { MainColor, ligthColor, Danger } from "../../assets/colors";
import { connect } from "react-redux";
import { storage } from "../../helpers/asyncStorage";
import { LoadingModal } from "../../components/loadingModal";
import { StatusModal } from "../../components/statusModal";
import { FormContainer } from "../../components/formContainer";
import { CameraModal } from "../../components/cameraModal";
import { createVisit, findVisitdni } from "../../helpers";
import Avatar from "../../components/avatar.component";

let destinyCaption, imageCaption, imageVisitCaption;

let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};

let visitInitialValues = {
  name: null,
  lastName: null,
  dni: null,
  descriptionEntry: null,
  entryDate: new Date(),
  departureDate: new Date(),
  userZoneId: null,
  profileUri: null,
  profileFileName: null,
  profileFyleType: null,
  visitUri: null,
  visitFileName: null,
  visitFyleType: null,
};

const EntryScreen = ({ navigation, profile, saveVisit }) => {
  //console.log("profile from redux---", profile);

  const destinys = profile.userZone[0].Zona.Destinos;
  const userZoneId = profile.userZone[0].id;

  const [visitData, setVisitData] = useState(visitInitialValues);
  const [statusModalProps, setStatusModalProps] = useState(statusModalValues);

  const [camera, setCamera] = useState(false);
  const [type, setType] = useState("");
  const [profileCaption, setProfileCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [destiny, setDestiny] = useState("");
  const [entry, setEntry] = useState("");

  const [destinyId, setDestinyId] = useState(destinys[0].id);

  const [editable, setEditable] = useState(true);
  const nameRef = useRef();
  const lastNameRef = useRef();
  const dniRef = useRef();
  const destinyRef = useRef();

  //CLEAR INPUTS
  const clearInputs = () => {
    setName("");
    setLastName("");
    setDni("");
    setDestiny("");
    setSaveImg("");
    setImgUrl("");
    setVisitImg("");
  };
  //CREATE VISIT
  const registerVisit = async () => {
    setLoading(true);
    if (name.length === 0 || lastName.length === 0 || dni.length === 0) {
      setProfileCaption("Debe llenar todos los campos");
      setLoading(false);
      return;
    }

    visitData.destinyId = destinyId;
    visitData.userZoneId = userZoneId;

    let token = await storage.getItem("userToken");
    const res = await createVisit(visitData, token);
    console.log(res.data);

    // if (imgUrl.length === 0) {
    //   setImageCaption("Debe agregar una foto");
    //   setLoading(false);
    //   return;
    // }
    // if (visitImg.length === 0) {
    //   setImageVisitCaption("Debe agregar una foto como referencia al ingreso.");
    //   setLoading(false);
    //   return;
    // }

    // if (!name || !lastName || !dni) {
    //   setProfileCaption("Debe ingresar todos los datos");
    //   return;
    // }

    // let data = new FormData();
    // data.append("name", name);
    // data.append("lastName", lastName);
    // data.append("dni", dni);
    // data.append("file", { uri: imgUrl, name: fileName, type: fileType });
    // data.append("file", { uri: visitImg, name: fileName2, type: fileType2 });
    // data.append("entryDate", moment().toString());
    // data.append("departureDate", moment().toString());
    // data.append("descriptionEntry", entry);
    // data.append("userZoneId", userZoneId);
    // try {
    //   let res = await axios.post(
    //     `${API_PORT()}/api/createVisit/${destinyId}`,
    //     data,
    //     {
    //       headers: {
    //         "content-type": "multipart/form-data",
    //         Authorization: `bearer ${token}`,
    //       },
    //     }
    //   );

    //   if (!res.data.error) {
    //     setLoading(false);
    //     saveVisit(res.data.data);
    //     setSuccess(true);
    //     //clearInputs();
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   console.log(error.message);
    // }
  };
  //CHECK DNI
  const checkDni = async () => {
    const res = await findVisitdni(visitData.dni);
    console.log(res.data);
    if (!res.data.error) {
      console.log(res.data);
      let citizen = res.data.data.Visitante;
      //console.log(citizen)
      setVisitData((values) => ({
        ...values,
        name: citizen.name,
        lastName: citizen.lastName,
        profileUri: citizen.picture,
      }));
      setEditable(false);
    } else {
      console.log(res.data.msg);
    }
  };

  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  const profilePic = (uri, fileName, fileType, caption, changeImg) => {
    setVisitData((values) => ({
      ...values,
      profileUri: uri,
      profileFileName: fileName,
      profileFyleType: fileType,
    }));
    //imageCaption = caption,
  };
  const visitPic = (uri, fileName, fileType, caption) => {
    setVisitData((values) => ({
      ...values,
      visitUri: uri,
      visitFileName: fileName,
      visitFyleType: fileType,
    }));
    //imageVisitCaption = caption,
  };
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.containerKeyboard} behavior="padding">
        <TopNavigation title="Entrada" leftControl={goBackAction()} />
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <FormContainer title="Datos Personales">
            <View style={styles.pictureContainer}>
              {visitData.profileUri ? (
                <Avatar.Picture size={120} uri={visitData.profileUri} />
              ) : (
                <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />
              )}

              <TouchableOpacity
                onPress={() => {
                  setCamera(true), setType("profile");
                }}
                style={styles.openCameraButton}
              >
                <Ionicons name="ios-camera" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <Input
              title="Nombre"
              secureTextEntry={false}
              icon="ios-person"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current.focus()}
              onChangeText={(name) => {
                setVisitData((values) => ({ ...values, name }));
              }}
              editable={editable}
              ref={nameRef}
            />
            <Input
              title="Apellido"
              secureTextEntry={false}
              shape="flat"
              icon="ios-person"
              returnKeyType="next"
              onSubmitEditing={() => dniRef.current.focus()}
              onChangeText={(lastName) => {
                setVisitData((values) => ({ ...values, lastName }));
              }}
              editable={editable}
              ref={lastNameRef}
            />
            <View>
              <Input
                title="dni"
                secureTextEntry={false}
                shape="flat"
                icon="ios-card"
                keyBoradType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => destinyRef.current.focus()}
                onChangeText={(dni) => {
                  setVisitData((values) => ({ ...values, dni }));
                }}
                ref={dniRef}
              />
              <TouchableOpacity onPress={() => checkDni()}>
                <Ionicons name="ios-search" size={28} color="grey" />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.captionText}>{profileCaption}</Text>
            </View>
          </FormContainer>
          <FormContainer title="Datos de Ingreso">
            <View>
              <Text>Selecione un destino:</Text>
              {destinys ? (
                <Picker
                  selectedValue={destinyId}
                  onValueChange={(value) => setDestinyId(value)}
                  mode="dropdown"
                >
                  {destinys.map((elem) => (
                    <Picker.Item
                      label={elem.name}
                      value={elem.id}
                      key={elem.id}
                    />
                  ))}
                </Picker>
              ) : null}
            </View>
            <View>
              <Text style={styles.labelText}>* Foto de Entrada.</Text>

              <View>
                <Text style={styles.captionText}>{imageVisitCaption}</Text>
              </View>
              <View style={styles.pictureVisitContainer}>
                {visitData.visitUri ? (
                  <Image
                    source={{ uri: visitData.visitUri }}
                    style={{
                      width: "100%",
                      height: 250,
                      overflow: "hidden",
                      borderRadius: 5,
                    }}
                  />
                ) : (
                  <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />
                )}
                <TouchableOpacity
                  onPress={() => {
                    setCamera(true), setType("visit");
                  }}
                  style={styles.openCameraButton}
                >
                  <Ionicons name="ios-camera" size={32} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <Input
              title="Descipcion Entrada (opcional)"
              secureTextEntry={false}
              shape="flat"
              icon="md-create"
              onChangeText={(descriptionEntry) => {
                setVisitData((values) => ({ ...values, descriptionEntry }));
              }}
              value={entry}
            />
            <View>
              <Text style={styles.captionText}>{destinyCaption}</Text>
            </View>
          </FormContainer>
          <View style={{ width: "90%" }}>
            <MainButton
              title="Registrar Entrada"
              style={{ marginVertical: 5 }}
              onPress={() => registerVisit()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CameraModal
        status={camera}
        onClose={() => setCamera(false)}
        profile={profilePic}
        anotherPic={visitPic}
        type={type}
      />
      <LoadingModal status={loading} message="Guardando..." />
      <StatusModal
        {...statusModalProps}
        onClose={() =>
          setStatusModalProps((values) => ({ ...values, visible: false }))
        }
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const mapDispatchToProps = (dispatch) => ({
  saveVisit(visit) {
    dispatch({
      type: "SAVE_VISIT",
      payload: visit,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EntryScreen);

const styles = StyleSheet.create({
  containerKeyboard: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  pickPictureContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 5,
    padding: 8,
    elevation: 5,
  },
  pictureContainer: {
    height: 120,
    width: 120,
    alignSelf: "center",
    position: "relative",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 10,
    borderRadius: 120 / 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  pictureVisitContainer: {
    alignSelf: "center",
    position: "relative",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 250,
  },
  openCameraButton: {
    position: "absolute",
    bottom: 0,
    right: -15,
    backgroundColor: MainColor,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 10,
  },
  captionText: {
    fontSize: 15,
    fontWeight: "600",
    color: Danger,
  },
  labelText: {
    color: "#8e8e8e",
    fontSize: 14,
    fontWeight: "600",
  },
});
