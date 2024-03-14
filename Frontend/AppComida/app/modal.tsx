// components/ProductPage.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import QuantitySelector from "@/components/QuantitySelector";
import AdditionalList from "@/components/AdditionalList";
import helpers from "@/helpers/helpers";
import { useCartApi } from "@/contexts/ApiCartContext";

const ProductPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { addCart, editCart } = useCartApi();

  const {
    item,
    title,
    quantityInit = 1,
    selectedsInit = [],
    itemId,
  }: any = route.params;

  const [quantity, setQuantity] = useState(quantityInit);
  const [selectedsAdditional, setSelectedAdditionals] =
    useState<number[]>(selectedsInit);

  const addRemove = (id: number) => {
    // Verifique se o ID já está na lista de selecionados
    if (selectedsAdditional.includes(id)) {
      // Se estiver, remova-o
      setSelectedAdditionals(selectedsAdditional.filter((e) => e !== id));
    } else {
      // Se não estiver, adicione-o
      setSelectedAdditionals([...selectedsAdditional, id]);
    }
  };

  const calculateFinalPrice = () => {
    // Calcula o preço total dos adicionais selecionados
    const additionalPricesSum = selectedsAdditional.reduce(
      (sum, additionalId) => {
        const additional = item.Additional.find((a) => a.ID === additionalId);
        return sum + (additional?.Price || 0);
      },
      0
    );

    // Calcula o preço final considerando a quantidade e o preço base do item
    const finalPrice = quantity * (item.Price + additionalPricesSum);

    return finalPrice;
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: title ?? item.Name,
    });
  }, [navigation]);

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View>
        {item.Image ? (
          <Image source={{ uri: item.Image }} style={styles.productImage} />
        ) : null}
        <View
          style={{
            ...styles.productInfoContainer,
            marginTop: !item.Image ? 20 : undefined,
          }}
        >
          <Text style={styles.productName}>{item.Name}</Text>
          <Text style={styles.productDescription}>{item.Description}</Text>
          <Text style={styles.productPrice}>
            {helpers.formatCurrency(item.Price)}
          </Text>
        </View>
        {item.Additional && item.Additional.length > 0 ? (
          <AdditionalList
            additionals={item.Additional}
            selected={selectedsAdditional}
            onChange={addRemove}
          />
        ) : null}
      </View>
      <View style={{ ...styles.mainContainer, paddingBottom: insets.bottom }}>
        <QuantitySelector
          quantity={quantity}
          onIncrement={() => setQuantity(quantity + 1)}
          onDecrement={() =>
            setQuantity((quantity) => (quantity !== 1 ? quantity - 1 : 1))
          }
        />
        <TouchableOpacity
          style={styles.btns}
          onPress={() => {
            !itemId
              ? addCart({
                  item,
                  additionals: selectedsAdditional,
                  quantity,
                })
              : editCart({
                  item,
                  additionals: selectedsAdditional,
                  quantity,
                  id: itemId,
                });
            navigation.goBack();
          }}
        >
          <Text style={{ fontWeight: "500", color: Colors.light.white }}>
            {!itemId ? Texts.add : Texts.alter}
          </Text>
          <Text style={{ fontWeight: "500", color: Colors.light.white }}>
            {helpers.formatCurrency(calculateFinalPrice())}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: Colors.light.white,
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,

    backgroundColor: Colors.light.background,
  },
  btns: {
    width: "65%",
    backgroundColor: Colors.dark.tint,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  productInfoContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 16,
    color: Colors.light.secondaryText,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "400",
    color: "green",
  },
});

export default ProductPage;
