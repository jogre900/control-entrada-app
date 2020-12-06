import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Vibration,
  Animated,
} from "react-native";
import { connect } from "react-redux";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";

//componentes
import { API_PORT } from "../../config/index.js";
import { TopNavigation } from "../../components/TopNavigation.component.jsx";
import { Header } from "../../components/header.component";
import Input from "../../components/input.component.jsx";
import { MainButton } from "../../components/mainButton.component";
import moment from "moment";
import { MainColor } from "../../assets/colors";

const ZonasScreen = ({
  navigation,
  companyRedux,
  saveZones,
  addZones,
  removeZones,
  zonesRedux,
}) => {
  //console.log("company REdux  ", companyRedux);
  // console.log("company REdux  ", zonesRedux);
  const [selectItem, setSeletedItem] = useState([]);
  const [changeStyle, setChangeStyle] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [zone, setZone] = useState([]);
  const [zoneName, setZoneName] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [entranceTime, setEntranceTime] = useState(new Date());
  const [departureTime, setDepartureTime] = useState(new Date());
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [scaleUp, setScaleUp] = useState(new Animated.Value(0));
  // const opacityInterpolate = scaleUp.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0.1, 1],
  // });

  const showCheckMark = () => {
    Animated.timing(scaleUp, {
      toValue: 1,
      duration: 1000,
    }).start();
  };
  const hideCheckMark = () => {
    Animated.timing(scaleUp, {
      toValue: 0,
      duration: 1000,
    }).start();
  };

  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("admin-home")}>
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  //LOADING
  const Splash = () => {
    return (
      <View>
        <ActivityIndicator size="large" color="#ff7e00" />
      </View>
    );
  };

  //REGISTER
  const saveSuccess = () => {
    Alert.alert("Registro Exitoso!");
    setSuccess(false);
  };

  //CLEAR INPUTS
  const clearInputs = () => setZoneName("");

  //TIMEPICKER
  const displayTimePicker = () => {
    setShow1(true);
  };

  const showMode = (currentMode) => {
    setShow1(true);
    //setMode(currentMode);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || entranceTime;
    setShow1(false);
    setEntranceTime(currentDate);
  };

  const displayTimePicker2 = () => {
    showMode2("date");
  };

  const showMode2 = (currentMode) => {
    setShow2(true);
    //setMode(currentMode);
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || departureTime;
    setShow2(Platform.OS === "ios");
    setDepartureTime(currentDate);
  };

  //ZONE API

  const requestZone = async () => {
    try {
      let res = await axios.get(
        `${API_PORT()}/api/findZones/${companyRedux.id}`
      );
      if (!res.data.error && res.data.data.length > 0) {
        setZone(res.data.data);
        await saveZones(res.data.data);
      } else {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const createZone = async () => {
    try {
      let res = await axios.post(
        `${API_PORT()}/api/createZone/${companyRedux.id}`,
        {
          zone: zoneName,
          firsEntryTime: entranceTime.toString(),
          firsDepartureTime: departureTime.toString(),
        }
      );
      if (!res.data.error) {
        addZones(res.data.data);
        alert("Creacion con exito!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteZones = async (zonesId) => {
    setDeleted(false);
    try {
      let res = await axios({
        method: "DELETE",
        url: `${API_PORT()}/api/deleteZone`,
        data: {
          zonesId,
        },
      });
      console.log(res.data)
      if (!res.data.error) {
        await removeZones(zonesId);
        setSeletedItem([]);
        alert("Borrado!!");
        setDeleted(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const clearSelect = () => {
    setSeletedItem([]);
  };
  const onLong = (id) => {
    if (selectItem.includes(id)) {
      setSeletedItem((value) => value.filter((elem) => elem !== id));
      hideCheckMark();
      return;
    }
    Vibration.vibrate(100),
      setSeletedItem(selectItem.concat(id)),
      showCheckMark();
    setChangeStyle(!changeStyle);
  };
  // useEffect(() => {
  //   requestCompany();
  // }, []);
  // useEffect(() => {
  //   requestZone();
  // }, [deleted]);

  useFocusEffect(
    React.useCallback(() => {
      //setZone([]);
      setSeletedItem([]);
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      {selectItem.length >= 1 ? (
        <Header
          value={selectItem.length}
          clearAction={() => clearSelect()}
          deleteAction={() => deleteZones(selectItem)}
        />
      ) : (
        <TopNavigation title="Zonas" leftControl={goBackAction()} />
      )}
      <ScrollView>
        <View>
          <View>
            {zonesRedux.length > 0 ? (
              zonesRedux.map((item, i) => (
                <View key={i}>
                  <TouchableOpacity
                    onPress={
                      selectItem.length >= 1
                        ? () => onLong(item.id)
                        : () =>
                            navigation.navigate("zone_detail", {
                              id: item.id,
                              zone: item.zone,
                              destinys: item.Destinos,
                              watchmen: item.encargado_zona,
                              entryTime: item.firsEntryTime,
                              departureTime: item.firsDepartureTime,
                              companyId: item.companyId,
                            })
                    }
                    onLongPress={() => onLong(item.id)}
                    delayLongPress={200}
                    style={[
                      selectItem.includes(item.id)
                        ? { backgroundColor: "rgba(20, 144, 150, 0.4)" }
                        : { backgroundColor: "#fff" },
                      styles.listItemBox,
                    ]}
                  >
                    <View>
                      <Text>{item.zone}</Text>
                      {/* {selectItem.includes(item.id) ? (
                        <Animated.View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: 22,
                            width: 22,
                            borderRadius: 22 / 2,
                            borderColor: "#fff",
                            borderWidth: 0.5,
                            transform: [{ scale: scaleUp }],
                          }}
                        >
                          <Ionicons
                            name="md-checkmark-circle"
                            size={22}
                            color="#09f"
                          />
                        </Animated.View>
                      ) : null} */}
                    </View>
                    <Text>
                      Entrada: {moment(item.firsEntryTime).format("HH: mm a")}
                    </Text>
                    <Text>
                      Salida: {moment(item.firsDepartureTime).format("HH:mm a")}
                    </Text>
                    <Ionicons name="md-pin" size={28} color="grey" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="small" color={MainColor} />
              </View>
            )}
          </View>
          <Text>Crear Zona</Text>

          <Input
            style={{ borderColor: "black", marginBottom: 10 }}
            styleInput={{ color: "black" }}
            title="NombreZona"
            textColor="black"
            shape="square"
            alignText="center"
            returnKeyType="next"
            onChangeText={(nombre) => {
              setZoneName(nombre);
            }}
            value={zoneName}
          />
          <View>
            <TouchableOpacity onPress={() => displayTimePicker()}>
              <Text>Hora de Entrada</Text>
            </TouchableOpacity>
            <Text>
              hora de entrada: {moment(entranceTime).format("HH:mm a")}
            </Text>
            {show1 && (
              <DateTimePicker
                value={entranceTime}
                mode={"time"}
                is24Hour={false}
                display="default"
                onChange={onChange}
              />
            )}
          </View>
          <View>
            <TouchableOpacity onPress={() => displayTimePicker2()}>
              <Text>Hora de Salida</Text>
            </TouchableOpacity>
            <Text>
              hora de salida: {moment(departureTime).format("HH:mm a")}
            </Text>
            {show2 && (
              <DateTimePicker
                value={departureTime}
                mode={"time"}
                is24Hour={false}
                display="default"
                onChange={onChange2}
              />
            )}
          </View>
          {entranceTime > departureTime
            ? console.log("Es mayor!!!")
            : console.log("Es menor.!!")}

          <MainButton
            title="Registrar Zona"
            onPress={() => {
              createZone();
            }}
          />
        </View>
        {saving ? <Splash /> : null}
        {success && saveSuccess()}
      </ScrollView>
    </View>
  );
};

const stateToProps = (state) => ({
  companyRedux: state.profileReducer.company,
  zonesRedux: state.zonesReducer.zones,
});

const mapDispatchToProps = (dispatch) => ({
  // saveZones(zones) {
  //   dispatch({
  //     type: "setZones",
  //     payload: zones,
  //   });
  // },
  addZones(zones) {
    dispatch({
      type: "addZones",
      payload: zones,
    });
  },
  removeZones(zonesId) {
    dispatch({
      type: "REMOVE_ZONES",
      payload: zonesId,
    });
  },
});

export default connect(stateToProps, mapDispatchToProps)(ZonasScreen);

const styles = StyleSheet.create({
  listItemBox: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 5,
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "#fff",
    marginVertical: 10,
  },
  selectedItem: {
    backgroundColor: "rgba(20, 144, 150, 0.4)",
  },
});
