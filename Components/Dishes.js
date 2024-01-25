import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

const Dishes = ({ route, navigation }) => {
  const { dishes, price } = route.params;

  const [selectedDish, setSelectedDish] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const handleAddToCart = async (dish, itemPrice) => {
    try {
      const existingCartData = await AsyncStorage.getItem('cart');
      const cart = existingCartData ? JSON.parse(existingCartData) : [];

      cart.push({ dish, price: itemPrice });

      await AsyncStorage.setItem('cart', JSON.stringify(cart));

      setSelectedDish(dish);

      setTotalPrice((prevTotal) => prevTotal + itemPrice);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = await AsyncStorage.getItem('cart');
      const parsedOrderData = orderData ? JSON.parse(orderData) : [];

      navigation.navigate('OrderDetails', { orderData: parsedOrderData });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dishes Available</Text>
      <FlatList
        data={dishes}
        keyExtractor={(item) => item.dishId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleAddToCart(item.dishName, item.price)}>
            <View style={styles.dishContainer}>
              <Text style={styles.dishName}>
                {item.dishName} - ${item.price} {selectedDish === item.dishName ? '(Added to Cart)' : ''}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.total}>TOTAL: ${totalPrice.toFixed(2)}</Text>
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Icon name="shopping-cart" size={24} color="white" /> 
   </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  dishContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'purple',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  placeOrderButton: {
    backgroundColor: '#ff4081',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Dishes;
