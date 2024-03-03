import Colors from "@/constants/Colors";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface QuantitySelectorProps {
  quantity?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  onDelete?: (item: object) => void;
  mini?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity = 1,
  onIncrement,
  onDecrement,
  mini = false,
  onDelete,
  disabled,
}) => {
  const fontSizeAlt = mini ? 15 : 18;
  return (
    <View style={{ ...styles.container, padding: disabled ? 5 : undefined }}>
      {!disabled ? (
        <View>
          {onDelete && quantity === 1 ? (
            <TouchableOpacity
              onPress={onDelete}
              style={{ ...styles.button, paddingHorizontal: 12 }}
            >
              <MaterialIcons
                name="delete"
                size={fontSizeAlt}
                color={Colors.light.tint}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onDecrement} style={styles.button}>
              <Text
                style={{
                  ...styles.buttonText,
                  fontSize: fontSizeAlt,
                  color:
                    quantity == 1
                      ? Colors.light.secondaryText
                      : Colors.light.tint,
                }}
              >
                -
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      <Text
        style={{
          ...styles.quantity,
          fontSize: fontSizeAlt - 1,
          color: disabled ? Colors.light.secondaryText : undefined,
        }}
      >
        {quantity}
      </Text>
      {!disabled ? (
        <TouchableOpacity onPress={onIncrement} style={styles.button}>
          <Text style={{ ...styles.buttonText, fontSize: fontSizeAlt }}>+</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.light.tabIconDefault,
    borderWidth: 1,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontWeight: "bold",
    borderRadius: 3,
  },
  buttonText: {
    color: Colors.light.tint,
    fontSize: 18,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 15,
  },
});

export default QuantitySelector;
