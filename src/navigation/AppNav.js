import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Login from "../components/Login";
import Main from "../components/Main";

const stackNavigatorOptions = {
  headerShown: false,
};

const appNav = createStackNavigator(
  {
    Login: { screen: Login },
    Main: { screen: Main },
  },
  {
    defaultNavigationOptions: stackNavigatorOptions,
  }
);

export default createAppContainer(appNav);
