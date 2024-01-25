import React, { useState, useEffect } from 'react';
import { Image, Modal, View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert,LogBox } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/FontAwesome';
LogBox.ignoreAllLogs();
const RestaurantList = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    getLocationPermission();
    fetchRestaurants();
  }, []);

  const RenderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('★');
      } else {
        stars.push('☆');
      }
    }
    return stars.join(' ');
  };

  const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
    }
  };

  const fetchRestaurants = () => {
    axios.get('https://658552e2022766bcb8c85fa7.mockapi.io/api/restaurants')
      .then(response => {
        setRestaurants(response.data);
      
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const showRestaurantDetailsModal = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    const address = await getReverseGeocodeAsync(restaurant.latLng.latitude, restaurant.latLng.longitude);
    setAddress(address);
    setModalVisible(true);
  };
  const navigateToMapScreen = (restaurant) => {
    navigation.navigate('Map', {
      name: restaurant.name,
      latitude: restaurant.latLng.latitude,
      longitude: restaurant.latLng.longitude,
    
    }  
  );
  };
  const navigateToDishesScreen = (dishes) => {
    navigation.navigate('Dishes', {
      dishes: dishes,
      
    });
  };
  
  const getReverseGeocodeAsync = async (latitude, longitude) => {
    try {
      let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      return addressResponse[0];
    } catch (error) {
      console.error(error);
    }
  };

  const renderRestaurantItem = ({ item }) => {
    
    const randomRating = Math.floor(Math.random() * 5) + 1;
     
    return (
     
     <TouchableOpacity
        onPress={()=>{navigateToDishesScreen(item.dishes)}}
        onLongPress={() => showRestaurantDetailsModal(item)}
        style={styles.restaurantItem}>
        <Image style={styles.restaurantImage} source={require("../assets/icon.jpg")} />
        <View style={{padding:3}}>
        
          <Text style={styles.restaurantName}>{item.name}</Text>
          <Text style={[styles.restaurantRating,{margin:10}]}>{RenderStars(randomRating)}</Text>
        </View>
        <TouchableOpacity
       onPress={()=>(navigateToMapScreen(item))}
          style={styles.mapButton}
        >
          <Icon name="map-marker" size={34} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Restaurant List</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRestaurantItem}
      />
      {selectedRestaurant && (
        <RestaurantDetailsModal
          isVisible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            setSelectedRestaurant(null);
            setAddress(null);
          }}
          restaurant={selectedRestaurant}
          address={address}
        />
      )}
    </SafeAreaView>
  );
};

const RestaurantDetailsModal = ({ isVisible, onDismiss, restaurant, address }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onDismiss}
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.nameText}>{restaurant?.name}</Text>
          {address && (
            <>
              <Text style={styles.modalText}>Address: {address.street} {address.name}</Text>
              <Text style={styles.modalText}>City: {address.city}</Text>
              <Text style={styles.modalText}>Region: {address.region}</Text>
              <Text style={styles.modalText}>Country: {address.country}</Text>
              <Text style={styles.modalText}>Postal Code: {address.postalCode}</Text>
            </>
          )}
          <TouchableOpacity style={styles.button} onPress={onDismiss}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign:"center",
    color:"white"
  },
  restaurantItem: {
    flexDirection:"row",
    borderColor:"purple",
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth:2
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantImage: {
    width: 60, 
    height: 60,
    borderRadius: 50, 
     },
  restaurantCity: {
    fontSize: 16,
    color: 'gray',},
  
  
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    width: '85%',
    margin: 20,
    backgroundColor: "#fefefe",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  nameText: {
    fontSize: 24, 
    fontWeight: "bold",
    marginBottom: 10, 
  },
  modalText: {
    fontSize: 16, 
    marginBottom: 5, 
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#ff4081",
    shadowColor: "#ff4081",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 6,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 17,
    fontFamily: 'Avenir',
  },
   mapButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems:"right"
  },
  mapButton: {
    padding: 10,
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 75, 
    marginBottom: 10, 
  },
  
});

export default RestaurantList;
