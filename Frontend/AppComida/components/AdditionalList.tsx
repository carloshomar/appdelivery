// components/AdditionalList.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Additional } from "@/types";
import Texts from "@/constants/Texts";
import Colors from "@/constants/Colors";
import helpers from "@/helpers/helpers";

interface AdditionalListProps {
  additionals: Additional[];
  selected: number[];
  onChange?(id: number): void;
}

const AdditionalList: React.FC<AdditionalListProps> = ({
  additionals,
  selected = [],
  onChange,
}) => {
  const handlePress = (id: number) => {
    if (onChange) {
      onChange(id);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Texts.additionals}</Text>
      {additionals.map((additional) => (
        <TouchableOpacity
          key={additional.ID}
          style={styles.item}
          onPress={() => handlePress(additional.ID)}
        >
          <View style={styles.checkboxContainer}>
            <FontAwesome
              name={
                selected.includes(additional.ID) ? "check-circle" : "circle-o"
              }
              size={22}
              color={
                selected.includes(additional.ID)
                  ? Colors.light.tint
                  : Colors.light.tabIconDefault
              }
            />
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.additionalText,
                {
                  fontWeight: selected.includes(additional.ID) ? "500" : "400",
                },
              ]}
            >
              {additional.Name}
            </Text>
            <Text
              style={[
                styles.additionalText,
                {
                  fontWeight: selected.includes(additional.ID) ? "500" : "400",
                },
              ]}
            >
              {helpers.formatCurrency(additional.Price)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    marginBottom: 10,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 5,
    borderBottomColor: Colors.light.tabIconDefault,
    borderBottomWidth: 1,
  },
  checkboxContainer: {
    width: 30,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 0,
    justifyContent: "space-between",
    flexDirection: "row",
    height: 45,
    alignContent: "center",
    alignItems: "center",
  },
  additionalText: {
    fontSize: 15,
  },
});

export default AdditionalList;
