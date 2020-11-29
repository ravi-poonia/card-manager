import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CryptoJS from 'react-native-crypto-js';
import { CARDS_ASYNC_STORAGE_KEY, CIPHER_KEY, theme } from './../utils/constant';
import { ActivityIndicator, Colors, FAB, withTheme, List } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';


function RenderCard({ card, navigation }) {
  const [showPass, setShowPass] = useState(false);

  return (
    <List.Accordion
      title={card.displayName || card.name || 'My Card'}
      description={card.type}
      left={props => <List.Icon {...props} icon="credit-card" />}
    >
      <List.Item
        title="Number"
        description={card.number}
        style={{ marginLeft: 55 }}
        right={props =>
          <TouchableOpacity onPress={() => navigation.navigate('Card', { card })}>
            <List.Icon {...props} icon={'square-edit-outline'} />
          </TouchableOpacity>
        }
      />
      <List.Item
        title="CVV"
        description={card.cvc}
      />
      <List.Item
        title="Password"
        style={{ marginLeft: 55 }}
        description={showPass ? card.password : '*********'}
        right={props =>
          <TouchableOpacity onPress={() => setShowPass(value => !value)}>
            <List.Icon {...props} icon={showPass ? 'eye-off' : 'eye'} />
          </TouchableOpacity>
        }
      />
      <List.Item
        title="Expiry Date"
        description={card.expiry}
      />
      <List.Item
        title="Owner Name"
        description={card.name}
      />
    </List.Accordion>
  );
}

function Home(props) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFocused = props.navigation.isFocused();
  console.log('-----> isFocused', isFocused)

  useFocusEffect(
    React.useCallback(() => {
      getCards()
    }, [])
  );

  useEffect(() => {
    getCards();
  }, [isFocused]);

  async function getCards() {
    try {
      const value = await AsyncStorage.getItem(CARDS_ASYNC_STORAGE_KEY);
      if (value !== null) {
        let bytes = CryptoJS.AES.decrypt(value, CIPHER_KEY);
        let cardList = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log('-----> cardList', cardList)
        setCards(cardList);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('----->error ', e);
      // error reading value
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {
          loading ?
            <ActivityIndicator animating={true} color={Colors.red800} />
            :
            <View style={styles.listContainer}>
              <FlatList
                data={cards}
                renderItem={({ item }) => <RenderCard navigation={props.navigation} card={item} />}
              />
            </View>
        }
        <FAB
          style={styles.fab}
          icon="credit-card-plus"
          onPress={() => props.navigation.navigate('Card')}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  listContainer: {
    width: '100%',
  }
});


export default withTheme(Home);
