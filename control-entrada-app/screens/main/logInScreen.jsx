import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { TopNavigation } from "../../components/TopNavigation.component";
import { Divider } from "../../components/Divider";
import { MainButton } from "../../components/mainButton.component";
import Input from "../../components/input.component";

import { Ionicons } from "@expo/vector-icons";
import { MainColor, Danger } from "../../assets/colors";
import { LoadingModal } from "../../components/loadingModal";
import { login } from "../../helpers/";
import { FormContainer } from "../../components/formContainer";
import { RecoverPassModal } from "../../components/recoverPassModal";
import { StatusModal } from "../../components/statusModal";
import { validateEmail, validatePass } from '../../helpers/forms'
import { storage } from "../../helpers/asyncStorage";
import { routes } from '../../assets/routes'
import { BackAction } from '../../helpers/ui/ui'

let passModalValues = {
  visible: false,
  onClose: false,
};

let captionInitialValues = {
  email: null,
  password: null
}

let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};

let loginInitialValues = {
  email: '',
  password: ''
}

const LoginScreen = ({
  navigation,
  saveProfile,
  saveCompany,
  saveLogin,
  savePrivilege,
}) => {
  
  const [loginData, setLoginData] = useState(loginInitialValues)
  const [captionValues, setCaptionValues] = useState(captionInitialValues)
  const [prueba, setprueba] = useState({})


  const [caption, setCaption] = useState("");
  
  const [modalVisible, setModalVisible] = useState(false);
  const [passModal, setPassModal] = useState(passModalValues);
  const [modalProps, setModalProps] = useState(statusModalValues);

  const nextInput = useRef(null);
  
  //SIGN IN
  const signIn = async () => {
    
    
    setCaption("");
    
    // }else{
    //   if(!validateEmail(email)){
    //     setModalVisible(false);
    //     setEmailCaption('Debe ingresar un correo valido')
    //     return;
    //   }
    // }

    // const emailError = validateEmail(prueba.email)
    // const passError = validatePass(prueba.password)
    // if(emailError || passError){
    //   setCaptionValues(() => ({email: emailError, password: passError})) 
    //   return
    // }
    setModalVisible(true);
    try {
      const res = await login(prueba.email, prueba.password);
      if (!res.data.error) {
        let slogin = {
          token: res.data.token,
          userId: res.data.data.id,
        };

        let sprofile = {
          id: res.data.data.Employee.id,
          dni: res.data.data.Employee.dni,
          name: res.data.data.Employee.name,
          lastName: res.data.data.Employee.lastName,
          picture: res.data.data.Employee.picture,
          email: res.data.data.email,
        };
        if (res.data.data.userZone.length > 0) {
          sprofile.userZone = res.data.data.userZone;
        }
        let company = [];
        res.data.data.UserCompany.map((comp) => {
          company.push({
            id: comp.Company.id,
            companyName: comp.Company.companyName,
            businessName: comp.Company.businessName,
            nic: comp.Company.nic,
            city: comp.Company.city,
            address: comp.Company.address,
            phoneNumber: comp.Company.phoneNumber,
            phoneNumberOther: comp.Company.phoneNumberOther,
            logo: comp.Company.logo,
            privilege: comp.privilege,
            select: true,
          });
        });
        let privilege = res.data.data.UserCompany[0].privilege;
        let token = res.data.token;
        // await storage.removeItem("userToken", res.data.token);
        await storage.setItem("userToken", token);

        if (res.data.data.UserCompany.length > 1) {
          setModalVisible(false);
          navigation.navigate(); //TODO modal para seleccionar company
          //TODO enviar res.data.data.UserCompany como parametro
        }
        saveLogin(slogin);
        saveProfile(sprofile);
        saveCompany(company);
        savePrivilege(privilege);
        switch (privilege) {
          case "Watchman":
            setModalVisible(false);
            navigation.navigate(routes.WATCH , {
              screen: "watch-home",
            });
            break;
          case "Admin":
          case "Supervisor":
            setModalVisible(false);
            navigation.navigate(routes.ADMIN);
            break;
          default:
            break;
        }
      }else{
        setModalVisible(false);
        setModalProps((values) => ({
          ...values,
          visible: true,
          status: false,
          message: res.data.msg
        }));
      }
    } catch (error) {
      setModalVisible(false);
      setModalProps((values) => ({
        ...values,
        visible: true,
        status: false,
        message: error.message
      }));
    }
  };

  //CHECKPASS
  const checkNewPass = (status, message) => {
    if (status) {
      setModalProps((values) => ({
        ...values,
        visible: true,
        status: false,
        message,
      }));
    } else {
      setModalProps((values) => ({
        ...values,
        visible: true,
        status: true,
        message,
      }));
      setPassModal((values) => ({ ...values, visible: false }));
    }
  };
const handleChange = (name, value) => {
  console.log(name, value)
  setprueba((values) => ({...values, [name]: value}))
}
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Inicio" leftControl={BackAction(navigation)} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <FormContainer title="Ingrese Datos de Usuario">
          <View style={styles.subContainer}>
            <Input
              //styleInput={{ color: "white" }}
              icon="ios-mail"
              title="Correo"
              shape="flat"
              keyboardType="email-address"
              returnKeyType="next"
              caption={captionValues.email}
              onSubmitEditing={() => nextInput.current.focus()}
              onChangeText={email => handleChange("email", email)}
              // onChangeText={(email) => {
              //   setLoginData(values => ({...values, email})), setCaptionValues(values => ({...values, email: ''}))
              // }}
              //onChange={handleChange}
              
            />
            <Input
              //styleInput={{ color: "white" }}
              icon="ios-lock"
              title="Clave"
              shape="flat"
              returnKeyType="done"
              secureTextEntry={true}
              caption={captionValues.password}
              onSubmitEditing={() => signIn()}
              // onChangeText={(password) => {
              //   setLoginData(values => ({...values, password})), setCaptionValues(values => ({...values, password: ''}))
              // }}
              onChangeText={password => handleChange("password", password)}
              value={prueba.password}
              ref={nextInput}
            />
          </View>
          <View>
            <Text
              style={{
                color: Danger,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              {caption}
            </Text>
          </View>

          <MainButton
            style={{ marginTop: 20, marginBottom: 5 }}
            title="Iniciar Sesion"
            // onPress={() => console.log(prueba)}
            onPress={() => {
              signIn();
            }}
          />

          <Divider size="small" />
          <View style={styles.forgetcontainer}>
            <Text>Olvidaste tu contraseña?</Text>
            <TouchableOpacity
              onPress={() =>
                setPassModal((values) => ({ ...values, visible: true }))
              }
            >
              <Text style={{ color: MainColor }}> Recuperar</Text>
            </TouchableOpacity>
          </View>
        </FormContainer>
        <RecoverPassModal
          visible={passModal.visible}
          onClose={() =>
            setPassModal((values) => ({ ...values, visible: false }))
          }
          checkNewPass={checkNewPass}
        />
        <LoadingModal visible={modalVisible} message="Iniciando Sesión.." />
        <StatusModal
          onClose={() =>
            setModalProps((values) => ({ ...values, visible: false }))
          }
          {...modalProps}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
  },
  subContainer: {
    //marginVertical: 5,
    //backgroundColor: 'pink'
  },
  labelTitle: {
    fontSize: 16,
    lineHeight: 18,
    color: MainColor,
  },
  forgetcontainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  saveProfile(profile) {
    dispatch({
      type: "SAVE_PROFILE",
      payload: profile,
    });
  },
  saveCompany(company) {
    dispatch({
      type: "SAVE_COMPANY",
      payload: company,
    });
  },
  saveLogin(login) {
    dispatch({
      type: "SET_LOGIN",
      payload: login,
    });
  },
  savePrivilege(privilege) {
    dispatch({
      type: "SAVE_PRIVILEGE",
      payload: privilege,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
