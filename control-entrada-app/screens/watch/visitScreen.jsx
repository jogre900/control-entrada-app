import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Vibration,
} from "react-native";

import { TopNavigation } from "../../components/TopNavigation.component";
import { Ionicons } from "@expo/vector-icons";
import { MainColor, lightColor } from "../../assets/colors.js";
import { VisitCard } from "../../components/visitCard";
import { FloatingBotton } from "../../components/floatingBotton";
import { Spinner } from "../../components/spinner";
import { SearchVisitModal } from "../../components/searchVisitModal";
import { Header } from "../../components/header.component";
import { helpers } from "../../helpers";
import { storage } from "../../helpers/asyncStorage";
import { StatusModal } from "../../components/statusModal";
import { PrompModal } from "../../components/prompModal";
import { NotFound } from "../../components/NotFound";
import { BackAction } from "../../helpers/ui/ui";
import { routes } from "../../assets/routes";
import { connect } from "react-redux";

let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};

const VisitScreen = ({
  navigation,
  profile,
  saveVisit,
  visitsRedux,
  removeVisit,
}) => {
  const [statusModalProps, setStatusModalProps] = useState(statusModalValues);
  const [loading, setLoading] = useState(false);
  const [selectItem, setSeletedItem] = useState([]);
  const [active, setActive] = useState(false);
  const [findIt, setFindIt] = useState(false);
  const [promp, setPromp] = useState(false);
  const [hasVisit, setHasVisit] = useState(true);
  const [visits, setVisits] = useState([]);
  const [visitsDni, setvisitsDni] = useState();
  let destinys = [];
  profile.userZone[0].Zona.Destinos.map(({ id }) => destinys.push(id));
  const searchRef = useRef();

  //REQUEST TODAY VISITS
  const todayVisit = async () => {
    //setVisits([]);
    setLoading(true);
    const token = await storage.getItem("userToken");
    try {
      const res = await helpers.fetchVisitDestiny(destinys, token);
      console.log("res de visitas--", res.data);
      if (res.data.msg === "Cuenta suspendida") {
        setLoading(false);
        setStatusModalProps((values) => ({
          ...values,
          visible: true,
          status: false,
          message: res.data.msg,
        }));
        return;
      } else if (!res.data.error && res.data.data.length) {
        setLoading(false);
        //setVisits(res.data.data);
        saveVisit(res.data.data);
      } else if (!res.data.data.length) {
        console.log("no hay visitas");
        setLoading(false);
        setHasVisit(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  //ONLONGPRESS
  const onLong = (id) => {
    if (selectItem.includes(id)) {
      setSeletedItem((value) => value.filter((elem) => elem !== id));
      //hideCheckMark();
      return;
    }
    Vibration.vibrate(100), setSeletedItem(selectItem.concat(id));
    //showCheckMark();
    //setChangeStyle(!changeStyle);
  };

  const clearList = () => setSeletedItem([]);

  const selectAll = () => {
    let array = [];
    visitsRedux.map(({ id }) => array.push(id));
    setSeletedItem(array);
  };
  //CHECK SEARCH
  const checkSearch = (data, status, message) => {
    if (!status) {
      setStatusModalProps((values) => ({
        ...values,
        visible: true,
        status: false,
        message,
      }));
    } else {
      setActive(false);
      setFindIt(true);
      setvisitsDni(data);
    }
  };
  //CHECK DELETE
  const checkDeleted = (status, message) => {
    if (status) {
      removeVisit(selectItem);
      clearList();
      setHasVisit(false);
    }
    setStatusModalProps((values) => ({
      ...values,
      visible: true,
      status,
      message,
    }));
  };

  useEffect(() => {
    todayVisit();
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {selectItem.length > 0 ? (
        <Header
          value={selectItem.length}
          clearAction={clearList}
          deleteAction={() => setPromp(true)}
          selectAction={selectAll}
        />
      ) : (
        <TopNavigation
          style={{ elevation: 0 }}
          title="Salida"
          leftControl={BackAction(navigation)}
        />
      )}

      {loading && <Spinner message="Cargando..." />}

      {visitsRedux.length > 0 && !loading && !findIt && (
        <ScrollView>
          {visitsRedux.map((elem) => (
            <TouchableOpacity
              key={elem.id}
              onPress={
                selectItem.length > 0
                  ? () => onLong(elem.id)
                  : () => navigation.navigate(routes.DEPARTURE, { id: elem.id })
              }
              onLongPress={() => onLong(elem.id)}
              delayLongPress={200}
            >
              <VisitCard
                data={elem}
                selected={selectItem.includes(elem.id) ? true : false}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {findIt &&
        visitsDni &&
        visitsDni.map((elem) => (
          <TouchableOpacity
            key={elem.id}
            onPress={
              selectItem.length > 0
                ? () => onLong(elem.id)
                : () => navigation.navigate("departure", { id: elem.id })
            }
            onLongPress={() => onLong(elem.id)}
            delayLongPress={200}
          >
            <VisitCard
              data={elem}
              selected={selectItem.includes(elem.id) ? true : false}
            />
          </TouchableOpacity>
        ))}

      <FloatingBotton icon="ios-search" onPress={() => setActive(true)} />
      <SearchVisitModal
        status={active}
        onClose={() => setActive(false)}
        search={checkSearch}
      />
      <StatusModal
        {...statusModalProps}
        onClose={() =>
          setStatusModalProps((values) => ({ ...values, visible: false }))
        }
      />
      <PrompModal
        visible={promp}
        onClose={() => setPromp(false)}
        deleted={checkDeleted}
        data={selectItem}
        url="visit"
      />
      {!hasVisit && <NotFound message="No hay visitas." />}
    </View>
  );
};
const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  visitsRedux: state.visits.today,
});

const mapDispatchToProps = (dispatch) => ({
  saveVisit(visits) {
    dispatch({
      type: "SAVE_VISITS",
      payload: visits,
    });
  },
  removeVisit(visits) {
    dispatch({
      type: "REMOVE_VISIT",
      payload: visits,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(VisitScreen);
