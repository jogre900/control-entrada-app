import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

//screens
import { SplashScreen } from "../components/splashScreen.component";
import { ProfileComponent } from "../components/profile.component";
import MainScreen from "../screens/main/mainScreen";
import LoginScreen from "../screens/main/logInScreen";
import RegisterScreen from "../screens/main/registerScreen";
import { WatchNavigator } from "./watch.navigator";
import AdminNavigator from "./admin.navigator";
import {TermsScreen} from '../screens/main/termsAndConditionsScreen'

const stack = createStackNavigator();

const options = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
}

export const MainNavigator = (props) => {
  return (
    <stack.Navigator headerMode="none" initialRouteName="Main">
      <stack.Screen name="Main" component={MainScreen} />
      <stack.Screen name="LogIn" component={LoginScreen} />
      <stack.Screen name="watch">
        {() => <WatchNavigator {...props} />}
      </stack.Screen>
      {/* <stack.Screen name="super" component={SuperNavigator} /> */}
      <stack.Screen name="register" component={RegisterScreen} />
      <stack.Screen name="terms" component={TermsScreen} options={options}/>
      <stack.Screen name="admin">
        {() => <AdminNavigator {...props} />}
      </stack.Screen>
    </stack.Navigator>
  );
};
