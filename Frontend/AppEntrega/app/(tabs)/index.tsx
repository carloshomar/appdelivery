import { useAuthApi } from "@/contexts/AuthContext";
import Home from "../pages/home";
import HomeDelivery from "../pages/home_delivery";
import Texts from "@/constants/Texts";
import Strings from "@/constants/Strings";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

function index() {
  const { inWork } = useAuthApi();
  const nav = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) nav.setOptions({ title: Strings.inicio });
  }, [isFocused]);

  return inWork.status ? <HomeDelivery /> : <Home />;
}
export default index;
