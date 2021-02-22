import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Avatar from "./avatar.component";
import { Ionicons } from "@expo/vector-icons";

export const ZoneDetailCard = ({ data }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        width: "90%",
        borderRadius: 5,
        marginVertical: 2.5,
        padding: 8,
        alignItems: 'center'
      }}
    >
      <Image
        source={require("../assets/images/map.jpg")}
        style={{
          width: 56,
          height: 56,
          borderRadius: 56 / 2,
        }}
      />
      {/* <Avatar.Picture size={60} uri="../assets/images/map.jpg" /> */}
      <View
        style={{
          //backgroundColor: "beige",
          marginLeft: 15,
        }}
      >
        <Text style={styles.labelText}>Horario</Text>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 1.5
            }}
          >
            <Ionicons
              name="ios-timer"
              size={24}
              color="green"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.contentText}>{data.firsEntryTime}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10
            }}
          >
            <Ionicons
              name="ios-timer"
              size={24}
              color="red"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.contentText}>{data.firsDepartureTime}</Text>
          </View>
        </View>
        <View
          style={{
            //justifyContent: "flex-start",
            alignItems: 'flex-start',
            marginVertical: 1.5
            //backgroundColor: "blue",
          }}
        >
          <View style={{
              //backgroundColor: 'red',
              justifyContent: 'center',
              alignItems: 'center'
          }}>
            <Text style={styles.contentText}>25</Text>
            <Text style={styles.labelText}>Entradas</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
  },
  labelText: {
    fontSize: 14,
    color: "#8e8e8e",
  },
});
