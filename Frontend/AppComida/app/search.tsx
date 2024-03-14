import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useNavigation } from "@react-navigation/native";
import Texts from "@/constants/Texts";
import helpers from "@/helpers/helpers";
import Colors from "@/constants/Colors";
import api from "@/services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useCartApi } from "@/contexts/ApiCartContext";

export default function Search() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();
  const { establishment } = useCartApi();

  async function init() {
    const { data } = await api.get("/api/order/products/" + establishment.id);
    setProducts(data);
    setFilteredProducts(data);
  }

  useEffect(() => {
    init();
  }, []);

  const handleProductPress = (item: any) => {
    navigation.navigate("modal", { item, title: Texts.novopedido });
  };

  const handleSearch = (text: string) => {
    const filtered = products.filter((item: any) =>
      item.Name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View
        style={{
          padding: 10,
          paddingBottom: 0,
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View style={{ width: 35, backgroundColor: Colors.light.white }}>
          <MaterialIcons name="search" color={Colors.light.tint} size={25} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome..."
          onChangeText={(text) => {
            setSearchText(text);
            handleSearch(text);
          }}
          value={searchText}
        />
      </View>

      <View style={{ marginTop: 1 }}>
        {filteredProducts.map((item: any, index: number) => (
          <TouchableOpacity
            key={item.ID}
            onPress={() => handleProductPress(item)}
            style={{
              ...styles.productContainer,
            }}
          >
            {item.Image ? (
              <Image source={{ uri: item.Image }} style={styles.productImage} />
            ) : null}
            <View style={styles.productDetails}>
              <View>
                <Text style={styles.productName}>{item.Name}</Text>
                <Text style={styles.description} numberOfLines={4}>
                  {item.Description}
                </Text>
              </View>
              <Text style={styles.productPrice}>
                <Text style={styles.priceValue}>
                  {helpers.formatCurrency(item.Price)}
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    padding: 10,
    paddingLeft: 0,
    marginBottom: 10,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.tabIconDefault,
    width: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: "600",
    paddingBottom: 20,
    color: Colors.light.text,
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
    flexDirection: "row-reverse",
    width: "100%",
    minHeight: 85,
    borderBottomColor: Colors.light.tabIconDefault,
    borderBottomWidth: 1,
    backgroundColor: Colors.light.white,
    padding: 5,
    marginBottom: 1,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  productDetails: {
    justifyContent: "space-between",
    flex: 1,
    marginLeft: 5,
  },
  productImage: {
    width: 90,
    height: 80,
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
    fontWeight: "400",
    marginTop: 10,
  },
  priceValue: {
    fontSize: 14,
    color: "green",
  },
});
