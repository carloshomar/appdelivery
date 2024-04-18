import Colors from "@/constants/Colors";
import helper from "@/helpers/helper";
import { useNavigation } from "expo-router";
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const OrderList = ({ orders }: any) => {
  const nav = useNavigation();
  const groupOrdersByDate = () => {
    const groupedOrders = {} as any;
    orders.forEach((order: any) => {
      const day = helper.formatDateNoHour(order.operationDate);
      if (!groupedOrders[day]) {
        groupedOrders[day] = [];
      }
      groupedOrders[day].push(order);
    });
    return groupedOrders;
  };

  // Renderizar os itens de pedido para cada dia
  const renderOrderItemsForDay = (date, orderItems) => {
    const totalDeliveryValue = orderItems.reduce(
      (total: number, item: any) => total + item.deliveryValue,
      0
    );

    return (
      <>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.dateSeparator}>{date}</Text>
          <Text
            style={{
              ...styles.dateSeparator,
              fontSize: 12,
            }}
          >
            {helper.formatCurrency(totalDeliveryValue)}
          </Text>
        </View>
        {orderItems.map((item: any) => renderOrderItem(item))}
      </>
    );
  };

  // Renderizar um item de pedido
  const renderOrderItem = (item) => (
    <TouchableOpacity
      style={styles.orderItemContainer}
      onPress={() => nav.navigate("extract_view", item)}
    >
      <View>
        <Text style={styles.establishmentName}>{item.establishment.name}</Text>
        <Text style={styles.orderDate}>
          {helper.formatDate(item.operationDate)}
        </Text>
      </View>
      <Text style={styles.deliveryValue}>
        {helper.formatCurrency(item.deliveryValue)}
      </Text>
    </TouchableOpacity>
  );

  // Agrupar os pedidos por data
  const groupedOrders = groupOrdersByDate(orders);

  return (
    <FlatList
      data={Object.entries(groupedOrders)}
      renderItem={({ item }) => renderOrderItemsForDay(item[0], item[1])}
      keyExtractor={(item, index) => index.toString()}
      style={styles.flatList}
    />
  );
};

const styles = StyleSheet.create({
  orderItemContainer: {
    borderBottomWidth: 1,
    borderColor: Colors.light.tabIconDefault,
    paddingVertical: 10,
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.white,
  },
  establishmentName: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "400",
    color: Colors.light.text,
  },
  orderDate: {
    fontWeight: "300",
    color: Colors.light.text,
  },
  deliveryValue: {
    fontSize: 16,
    fontWeight: "300",
    color: Colors.light.text,
  },
  dateSeparator: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  flatList: {
    flex: 1,
  },
});

export default OrderList;
