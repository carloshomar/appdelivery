import PaymentComponent from "@/components/PaymentComponent";
import { ESTABLISHMENT } from "@/config/config";
import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { useCartApi } from "@/contexts/ApiCartContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function Payments() {
  const nav = useNavigation();
  const { setPaymentMethod } = useCartApi();
  return (
    <View style={styles.container}>
      {ESTABLISHMENT.payment.map((e) => (
        <PaymentComponent
          hiddenTitle={false}
          title={Texts[e.type]}
          icon={e.icon}
          onPress={() => {
            setPaymentMethod(e);
            nav.goBack();
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  btns: {},
  container: {
    backgroundColor: Colors.light.background,
    height: "100%",
  },
});

export default Payments;
