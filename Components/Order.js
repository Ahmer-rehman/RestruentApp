import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderDetails = ({ route, navigation }) => {
  const { orderData } = route.params;
  const [totalPrice, setTotalPrice] = useState(
    orderData.reduce((total, item) => total + item.price, 0)
  );

  const handleDeleteItem = async (itemIndex) => {
    try {
      const updatedOrderData = [...orderData];
      const deletedItem = updatedOrderData.splice(itemIndex, 1)[0];

      setTotalPrice((prevTotal) => prevTotal - deletedItem.price);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedOrderData));

      navigation.setParams({ orderData: updatedOrderData });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <FlatList
        data={orderData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleDeleteItem(index)}
            style={styles.orderItem}
          >
            <View style={styles.itemInfo}>
              <Text style={styles.dishName}>{item.dish}</Text>
              <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
            </View>
            
          </TouchableOpacity>
        )}
      />
      <Text style={styles.total}>TOTAL: ${totalPrice.toFixed(2)}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin:10,
    marginBottom: 10,
    width: '100%',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
    
  },
  price: {
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
});

export default OrderDetails;
