import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import Texts from "@/constants/Texts";
import helpers from "@/helpers/helpers";
import Colors from "@/constants/Colors";

const ProductCategory = ({ category }: any) => {
  const navigation = useNavigation();

  const handleProductPress = (item: any) => {
    navigation.navigate("modal", { item, title: Texts.novopedido });
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.categoryTitle}>{category?.Name}</Text>
      </View>

      <View style={styles.categoryContainer}>
        <View style={styles.listFather}>
          {category.Products.map((item: any, index: number) => (
            <TouchableOpacity
              key={item.ID}
              onPress={() => handleProductPress(item)}
              style={{
                ...styles.productContainer,
                borderBottomWidth:
                  category.Products.length - 1 === index ? 0 : 1,
              }}
            >
              {item.Image ? (
                <Image
                  source={{ uri: item.Image }}
                  style={styles.productImage}
                />
              ) : null}
              <View style={styles.productDetails}>
                <View>
                  <Text style={styles.productName}>{item.Name}</Text>
                  {item.Description ? (
                    <Text style={styles.description} numberOfLines={4}>
                      {item.Description}
                    </Text>
                  ) : null}
                </View>
                <Text
                  style={{
                    ...styles.productPrice,
                    marginTop: item.Description ? 10 : 0,
                  }}
                >
                  <Text style={styles.priceValue}>
                    {helpers.formatCurrency(item.Price)}
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {},
  categoryTitle: {
    fontSize: 24,
    fontWeight: "600",
    paddingBottom: 20,

    color: Colors.light.text,
  },
  container: {
    borderBottomColor: Colors.light.tabIconDefault,
    borderBottomWidth: 1,
    marginBottom: 15,
    marginTop: 15,
    paddingLeft: 10,
  },
  description: {
    marginTop: 0,
    width: "95%",
    color: Colors.light.secondaryText,
    fontSize: 12.5,
    textAlign: "justify",
  },
  listFather: {
    alignItems: "center",
    width: "100%",
    paddingLeft: 5,
    paddingRight: 5,
  },
  productContainer: {
    marginBottom: 10,
    flexDirection: "row-reverse",
    width: "100%",
    minHeight: 85,
    borderBottomColor: Colors.light.tabIconDefault,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  productDetails: {
    justifyContent: "space-between",
    flex: 1,
    marginLeft: 5,
  },
  productImage: {
    width: 100,

    height: 90,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault,
    marginRight: 5,
    borderRadius: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
    marginBottom: 5,
  },
  productPrice: {
    color: "green",
    fontWeight: "400",
    marginTop: 10,
  },
  priceValue: {
    fontSize: 14,
  },
});

export default ProductCategory;
