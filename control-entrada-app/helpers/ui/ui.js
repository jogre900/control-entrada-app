import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { MainButton } from "../../components/mainButton.component";
import { routes } from '../../assets/routes'
import { useSelector } from 'react-redux'
const size = 28;
const notificationNotRead = useSelector(state => state.profile.notificationNotRead)
export const DrawerAction = (navigation) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.toggleDrawer();
        }}
      >
        <Ionicons name="ios-menu" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export const BackAction = (navigation, route) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          route ? navigation.navigate(route) : navigation.goBack()
        }}
      >
        <Ionicons name="ios-arrow-back" size={size} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export const Notifications = (navigation) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.NOTIFICATION);
        }}
      >
        <Ionicons name="md-notifications" size={28} color="white" />
        <View style={styles.numberContainer}>
          <Text style={styles.number}>{notificationNotRead.length && notificationNotRead.length}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export const NavigateAction = (navigation, size, name, route) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(route)}>
      <Ionicons name={name} size={size} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  numberContainer: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  number: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff'
  }
})
