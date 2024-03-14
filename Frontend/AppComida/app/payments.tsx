import PaymentComponent from "@/components/PaymentComponent";
import { PAYMENT_TYPE } from "@/config/config";
import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { useCartApi } from "@/contexts/ApiCartContext";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";

function Payments() {
  const nav = useNavigation();
  const { setPaymentMethod } = useCartApi();
  return (
    <View style={styles.container}>
      {PAYMENT_TYPE.map((e) => (
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
