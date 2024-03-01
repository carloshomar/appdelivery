import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import helpers from "@/helpers/helpers";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import QuantitySelector from "./QuantitySelector";
import { useCartApi } from "@/contexts/ApiCartContext";
import { useNavigation } from "@react-navigation/native";

const OrderSummary = ({ data }: any) => {
  const { removeCart, editCart } = useCartApi();
  const navigation = useNavigation();

  const renderAdditionalItems = (additionals: any) => {
    return additionals.map((additional: any, index: number) => (
      <View key={index} style={styles.additionalItem}>
        <Text style={styles.additionalName}>{additional.Name}</Text>
      </View>
    ));
  };

  const renderItems = () =>
    data.map((item: any, index: number) => (
      <TouchableOpacity
        key={index}
        style={{
          ...styles.itemContainer,
          borderBottomWidth: index === data.length - 1 ? 0 : 1,
          paddingBottom: index === data.length - 1 ? 5 : 15,
        }}
        onPress={() => {
          navigation.navigate("modal", {
            item: item.item,
            quantityInit: item.quantity,
            title: Texts.novopedido,
            selectedsInit: item.additionals,
            itemId: item.id,
          });
        }}
      >
        <View style={styles.itemInfo}>
          <View style={styles.itemDetails}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.itemNameContainer}>
                <Text style={styles.itemName}>{item.item.Name}</Text>
                <View style={styles.additionalContainer}>
                  {renderAdditionalItems(
                    item.item.Additional.filter((e: any) =>
                      item.additionals.includes(e.ID)
                    )
                  )}
                </View>
                <Text style={styles.itemPrice}>
                  {helpers.formatCurrency(
                    (item.item.Price +
                      (item.item.Additional.filter((e: any) =>
                        item.additionals.includes(e.ID)
                      ).reduce(
                        (total: number, additional: any) =>
                          total + additional.Price,
                        0
                      ) ?? 0)) *
                      item.quantity
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.container2}>
              <QuantitySelector
                quantity={item.quantity}
                mini={true}
                onDelete={() => removeCart(item)}
                onDecrement={() =>
                  editCart({ ...item, quantity: item.quantity - 1 })
                }
                onIncrement={() => {
                  editCart({ ...item, quantity: item.quantity + 1 });
                }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Texts.carrinho}:</Text>
      {renderItems()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, paddingBottom: 0 },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  container2: {
    alignItems: "flex-end",
    alignContent: "flex-end",
    justifyContent: "flex-end",
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomColor: Colors.light.tabIconDefault,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  itemInfo: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    // alignItems: "center",
  },
  itemNameContainer: {},
  itemName: {
    fontSize: 14,
    fontWeight: "300",
    marginBottom: 5,
  },
  additionalContainer: {
    marginBottom: 10,
  },
  additionalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  additionalName: {
    fontSize: 11,
    color: Colors.light.secondaryText,
  },
  additionalPrice: {
    fontSize: 12,
    color: Colors.light.secondaryText,
    alignSelf: "flex-end",
    marginLeft: 10,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "300",
  },
});

export default OrderSummary;
