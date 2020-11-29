/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import CryptoJS from 'react-native-crypto-js';
import { CARDS_ASYNC_STORAGE_KEY, CIPHER_KEY, theme } from './../utils/constant';

function Card(props) {
  const passRed = React.createRef();
  const cardRef = React.createRef();

  const { card } = props.route && props.route.params || {};

  const [cardDetails, setCardDetails] = useState(card || {});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cardRef && cardRef.current.setValues(card);
  }, [card]);

  const _onChange = (formData) => {
    setCardDetails(details => ({ ...details, ...formData.values }));
  };

  const checkCard = () => {
    if (Object.keys(cardDetails).length > 0) {
      let values = Object.values(cardDetails).filter(el => el);
      if (values.length > 0) {

        return true;
      }
      return false;
    }
  };

  async function deleteCard() {
    const value = await AsyncStorage.getItem(CARDS_ASYNC_STORAGE_KEY);
    let cardList = [];
    if (value !== null) {
      let bytes = CryptoJS.AES.decrypt(value, CIPHER_KEY);
      cardList = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    let index = cardList.findIndex(card => card.id === cardDetails.id);
    if (index !== -1) {
      cardList.splice(index, 1);
    }
    let cipherText = CryptoJS.AES.encrypt(JSON.stringify(cardList), CIPHER_KEY).toString();
    await AsyncStorage.setItem(CARDS_ASYNC_STORAGE_KEY, cipherText);

    props.navigation.goBack();
  }

  async function saveCard(data) {
    if (checkCard()) {
      setLoading(true);
      const value = await AsyncStorage.getItem(CARDS_ASYNC_STORAGE_KEY);
      let cardList = [];
      if (value !== null) {
        let bytes = CryptoJS.AES.decrypt(value, CIPHER_KEY);
        cardList = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      if (cardDetails.id) {
        let index = cardList.findIndex(item => item.id === cardDetails.id);
        if (index !== -1) {
          cardList[index] = cardDetails;
        }
        else {
          cardList.push({ ...cardDetails, id: cardList.length + 1 });
        }
      }
      else {
        cardList.push({ ...cardDetails, id: cardList.length + 1 });
      }
      let cipherText = CryptoJS.AES.encrypt(JSON.stringify(cardList), CIPHER_KEY).toString();
      await AsyncStorage.setItem(CARDS_ASYNC_STORAGE_KEY, cipherText);
      setLoading(false);
    }

    props.navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <CreditCardInput
          autoFocus={false}
          ref={cardRef}
          allowScroll={true}
          requiresName
          requiresCVC

          labelStyle={styles.label}
          inputStyle={styles.input}
          validColor={'black'}
          invalidColor={'red'}
          placeholderColor={'darkgray'}

          onChange={_onChange}
        />
      </View>
      <View style={styles.textInput}>
        <TextInput
          label="Card Name"
          value={cardDetails.displayName}
          placeholder={cardDetails.name || 'My Card '}
          mode="outlined"
          onSubmitEditing={() => passRed && passRed.current.focus()}
          returnKeyType="next"
          onChangeText={text => {
            setCardDetails(details => ({ ...details, displayName: text }));
          }}
        />
      </View>
      <View style={styles.textInput}>
        <TextInput
          label="Password"
          ref={passRed}
          value={cardDetails.password}
          mode="outlined"
          secureTextEntry={!showPass}
          onChangeText={text => {
            setCardDetails(details => ({ ...details, password: text }));
          }}
          right={
            <TextInput.Icon
              name={showPass ? 'eye-off' : 'eye'}
              onPress={() => setShowPass(value => !value)}
            />
          }
        />
      </View>
      <Button
        mode="contained"
        style={styles.button}
        loading={loading}
        labelStyle={{ padding: 10 }}
        onPress={() => saveCard()}
      >
        Save
      </Button>
      {
        cardDetails.id &&
        <Button
          mode="contained"
          style={styles.delete}
          loading={loading}
          labelStyle={{ padding: 10 }}
          onPress={() => deleteCard()}
        >
          Delete
      </Button>
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  card: {
    height: 280,
  },
  label: {
    color: 'black',
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: 'black',
  },
  textInput: {
    height: 80,
    marginHorizontal: 20,
  },
  button: {
    marginHorizontal: 20,
  },
  delete: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: 'red',
  },
});


export default Card;
