import Colors from "@/constants/Colors";
import helper from "@/helpers/helper";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const OrderList = ({ orders }: any) => {
  const groupOrdersByDate = () => {
    const groupedOrders = {} as any;
    orders.forEach((order: any) => {
      const date = helper.formatDate(order.operationDate);
      if (!groupedOrders[date]) {
        groupedOrders[date] = [];
      }
      groupedOrders[date].push(order);
    });
    return groupedOrders;
  };

  // Renderizar os itens de pedido para cada dia
  const renderOrderItemsForDay = (date, orderItems) => (
    <>
      <Text style={styles.dateSeparator}>{date}</Text>
      {orderItems.map((item: any) => renderOrderItem(item))}
    </>
  );

  // Renderizar um item de pedido
  const renderOrderItem = (item) => (
    <View style={styles.orderItemContainer}>
      <View>
        <Text style={styles.establishmentName}>{item.establishment.name}</Text>
        <Text style={styles.orderDate}>
          {helper.formatDate(item.operationDate)}
        </Text>
      </View>
      <Text style={styles.deliveryValue}>
        {helper.formatCurrency(item.deliveryValue)}
      </Text>
    </View>
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
    fontWeight: "400",
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
