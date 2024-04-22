import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { AntDesign } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SwipeButton } from "react-native-expo-swipe-button";

export default function SwipeButtonDelivery({
  title,
  onComplete,
  disabled,
  loading,
}: any) {
  return (
    <SwipeButton
      onComplete={onComplete}
      title={title}
      titleStyle={styles.switTextStyle}
      circleBackgroundColor={Colors.light.tint}
      borderRadius={5}
      containerStyle={styles.swipContainer}
      goBackToStart={true}
      underlayStyle={{
        backgroundColor: Colors.light.tint,
        borderRadius: 5,
      }}
      titleContainerStyle={{
        backgroundColor: Colors.light.tint,
        borderRadius: 5,
      }}
      disabled={disabled || loading}
      underlayTitleContainerStyle={{ borderRadius: 5 }}
      Icon={<AntDesign size={20} name="check" color={Colors.light.white} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.tint,
    height: "100%",
    padding: 10,
    borderRadius: 5,

    justifyContent: "space-between",
  },
  switTextStyle: {
    color: Colors.light.white,
    fontWeight: "600",
    borderRadius: 5,

    fontSize: 16,
  },
  swipContainer: {
    borderWidth: 0.8,
    borderColor: Colors.light.tint,
    borderRadius: 5,
  },
});
