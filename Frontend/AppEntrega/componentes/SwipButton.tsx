import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { SwipeButton } from "react-native-expo-swipe-button";

export default function SwipeButtonDelivery({ title, onComplete }: any) {
  return (
    <SwipeButton
      onComplete={onComplete}
      title={title}
      titleStyle={styles.switTextStyle}
      circleBackgroundColor={Colors.light.tint}
      containerStyle={styles.swipContainer}
      underlayStyle={{ backgroundColor: Colors.light.tint }}
      Icon={<AntDesign size={20} name="check" color={Colors.light.white} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    height: "100%",
    padding: 10,
    justifyContent: "space-between",
  },
  switTextStyle: { color: Colors.light.tint, fontWeight: "600", fontSize: 16 },
  swipContainer: {
    borderWidth: 0.8,
    borderColor: Colors.light.tint,
  },
});
