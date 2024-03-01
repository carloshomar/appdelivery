import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Item } from "@/types";
import Texts from "@/constants/Texts";
import helpers from "@/helpers/helpers";
import { useCartApi } from "@/contexts/ApiCartContext";
import { ESTABLISHMENT } from "@/config/config";
import Colors from "@/constants/Colors";

interface OrderSummaryWithTotalProps {
  data: any[];
}

const OrderSummaryWithTotal: React.FC<OrderSummaryWithTotalProps> = ({
  data,
}) => {
  const { distance, deliveryValue } = useCartApi();

  const calculateFinalPrice = ({
    item,
    quantity,
    additionals = [],
  }: {
    item: Item;
    quantity: number;
    additionals?: number[];
  }): number => {
    const additionalPricesSum = additionals?.reduce((sum, additionalId) => {
      const additional = item.Additional.find(
        (a: any) => a.ID === additionalId
      );
      return sum + (additional?.Price || 0);
    }, 0);

    const finalPrice = quantity * (item.Price + (additionalPricesSum || 0));

    return finalPrice;
  };

  const subTotal = data
    .map((e) => calculateFinalPrice(e))
    .reduce((e, f) => e + f, 0);

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.textIcons, paddingTop: 15 }}>
        {Texts.resumo_valores}
      </Text>
      <View style={styles.container2}>
        <Text style={styles.textIcons}>{Texts.subtotal}:</Text>
        <Text style={styles.textIcons}>
          {helpers.formatCurrency(subTotal) ?? 0}
        </Text>
      </View>
      <View style={styles.container3}>
        {!distance ? (
          <>
            <Text style={styles.textIcons}>{Texts.entrega}:</Text>
            <Text style={{ ...styles.textIcons, fontSize: 12 }}>
              Calculando...
            </Text>
          </>
        ) : null}
        {distance && distance < ESTABLISHMENT.coords.max_distancy_delivery ? (
          <>
            <Text style={styles.textIcons}>{Texts.entrega}:</Text>
            <Text style={styles.textIcons}>
              {deliveryValue ? helpers.formatCurrency(deliveryValue) : null}
            </Text>
          </>
        ) : null}
        {distance && distance > ESTABLISHMENT.coords.max_distancy_delivery ? (
          <>
            <Text style={styles.textIcons}>{Texts.entrega}:</Text>
            <Text style={styles.textIcons}>{Texts.fora_area}</Text>
          </>
        ) : null}
      </View>

      <View style={styles.contianer4}>
        <Text style={styles.textIcons2}>{Texts.total}:</Text>
        <Text style={styles.textIcons2}>
          {helpers.formatCurrency((deliveryValue ?? 0) + (subTotal ?? 0))}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textIcons2: { fontSize: 18, fontWeight: "400" },
  container: {
    padding: 10,
    paddingTop: 0,
    paddingBottom: 20,
    borderTopColor: Colors.light.tabIconDefault,
    borderTopWidth: 1,
  },
  contianer4: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container2: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container3: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textIcons: {
    fontSize: 15,
    fontWeight: "300",
  },
});

export default OrderSummaryWithTotal;
