import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button } from 'react-native';

const MapScreen = ({route,navigation}) => {
    const { name, latitude, longitude } = route.params;
  console.log(latitude)
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: latitude,
              longitude:longitude,
                          }}
            title={name}
          />
        </MapView>
        <Button title="back" onPress={()=>{navigation.navigate("List")}}></Button>
      </SafeAreaView>
    );
  };
  export default MapScreen;