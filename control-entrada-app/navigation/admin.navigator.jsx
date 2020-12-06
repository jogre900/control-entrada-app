import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";
import DrawerHeader from "./drawerHeader";
import { MainColor, lightColor } from "../assets/colors";

//screens
import HomeAdminScreen from "../screens/admin/homeAdminScreen";
import { DetailViewScreen } from "../screens/admin/detailViewScreen";
import ZoneDetailScreen from "../screens/admin/zoneDetailScreen";
import { NotificationScreen } from "../screens/admin/notificationScreen";
import CompanyScreen from "../screens/admin/createCompanyScreen";
import ZonasScreen from "../screens/admin/zonesScreen";
import { DestinyScreen } from "../screens/admin/destinyScreen";
import { HistorialScreen } from "../screens/admin/historialScreen";
import PerfilScreen from "../screens/admin/perfilScreen";
import {EditProfileScreen} from '../screens/admin/editProfileScreen'
import { EmployeeScreen } from "../screens/admin/employeeScreen";
import CreateEmployeScreen from "../screens/admin/createEmployeeScreen";
import { EmployeeDetailScreen } from "../screens/admin/employeeDetailScreen";
const drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const options = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
}

function AdminNav() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="admin-home">
      <Stack.Screen name="admin-home" component={HomeAdminScreen} />
      <Stack.Screen name="detail-view" component={DetailViewScreen} options={options}/>
      <Stack.Screen name="notification" component={NotificationScreen} />
      <Stack.Screen name="edit_profile" component={EditProfileScreen} options={options}/>
      <Stack.Screen name="zone_detail" component={ZoneDetailScreen} options={options}/>
      <Stack.Screen name="employee_detail" component={EmployeeDetailScreen} options={options}/>
    </Stack.Navigator>
  );
}

const deleteToken = async () => {
  await AsyncStorage.removeItem("userToken");
};

const drawerData = [
  { label: "Inicio", route: "admin-home", icon: "ios-home" },
  { label: "Empresa", route: "Company", icon: "ios-business" },
  { label: "Historial", route: "Historial", icon: "ios-calendar" },
  { label: "Empleados", route: "Employee", icon: "ios-people" },
  { label: "Crear Empleado", route: "CreateEmployee", icon: "ios-person-add" },
  { label: "Zonas", route: "Zones", icon: "md-globe" },
  { label: "Destinos", route: "Destiny", icon: "ios-pin" },
];
const DrawerContent = (props) => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <DrawerHeader {...props} />
      <DrawerContentScrollView
        conte
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          {drawerData.map((data, i) => (
            <DrawerItem
              label={data.label}
              labelStyle={{ fontSize: 15 }}
              icon={({ size, color }) => (
                <Ionicons name={data.icon} size={size} color={color} />
              )}
              onPress={() => props.navigation.navigate(data.route)}
              key={i}
            />
          ))}
        </View>
      </DrawerContentScrollView>
      <View style={{}}>
        <DrawerItem
          label="Cerrar Sesion"
          labelStyle={{ fontSize: 15 }}
          icon={({ size, color }) => (
            <Ionicons name="ios-log-out" size={size} color={color} />
          )}
          onPress={() => {
            deleteToken().then(() => props.navigation.navigate("Main"));
          }}
        />
      </View>
    </View>
  );
};

const AdminNavigator = () => {
  return (
    <drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <drawer.Screen name="Home" component={AdminNav} />
      <drawer.Screen name="Profile" component={PerfilScreen} />
      <drawer.Screen name="Company" component={CompanyScreen} />
      <drawer.Screen name="Historial" component={HistorialScreen} />
      <drawer.Screen name="CreateEmployee" component={CreateEmployeScreen} />
      <drawer.Screen name="Employee" component={EmployeeScreen} />
      <drawer.Screen name="Zones" component={ZonasScreen} />
      <drawer.Screen name="Destiny" component={DestinyScreen} />
    </drawer.Navigator>
  );
};

export default AdminNavigator;

const styles = StyleSheet.create({
  headerDrawerContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "grey",
    paddingVertical: 10,
  },
  drawerLogo: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  footerDrawerContainer: {
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderColor: "grey",
  },
});
