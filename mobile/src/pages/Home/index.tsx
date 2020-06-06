import React from "react";
import {Feather as Icon} from "@expo/vector-icons";
import  { View, Image, StyleSheet, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import {RectButton} from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import axios from "axios";

interface IBGEuf{
  sigla: string
}
interface IBGEcities{
  nome: string
}
interface PickerSelectParams{
  label: string;
  value: string;
}
const Home = () => {
  const [uf, setUf] = React.useState('');
  const [city, setCity] = React.useState('');
  const [IBGEUfs, setIBGEUfs] = React.useState<String[]>([]); 
  const [IBGECities, setIBGECities] = React.useState<String[]>([]); 
  const navigation = useNavigation();

  //get ufs
  React.useEffect(()=>{
    axios.get<IBGEuf[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then(
      (res) => {
        const ufsInitials = res.data.map(uf => uf.sigla);
        setIBGEUfs(ufsInitials);
      }
    )
  }, []);

  //get cities based on selected uf
  React.useEffect(()=>{
    axios.get<IBGEcities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`).then(
      (res) => {
        const cities = res.data.map(uf => uf.nome);
        setIBGECities(cities);
      }
    )
  }, [uf]);

  function handleNavigateToPoints() {
    navigation.navigate("Points", {
      uf,
      city
    });
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ImageBackground 
          source={require("../../assets/home-background.png")} 
          style={styles.container}
          imageStyle={{ width:274, height:368 }}
      >
          <View style={styles.main}>
          <Image source={require("../../assets/logo.png")}/>
          <View>
            <Text style={styles.title} >Seu marketplace de coleta de residuos</Text>
            <Text style={styles.description} >Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
          </View>
          </View>

          <View style={styles.footer}>
            <RNPickerSelect
              //style={styles.input}
              onValueChange={setUf}
              items={IBGEUfs.map(uf => {
                return {
                  label: uf,
                  value: uf
                }
              } ) as PickerSelectParams[]}
            />
            <RNPickerSelect
              //style={styles.input}
              onValueChange={setCity}
              items={IBGECities.map(city => {
                return {
                  label: city,
                  value: city
                }
              }) as PickerSelectParams[]}
            />
            {/* <TextInput 
              style={styles.input} 
              placeholder="Digite a UF" 
              value={uf}
              maxLength={2}
              autoCapitalize="characters"
              autoCorrect={false}
              onChangeText={setUf}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Digite a Cidade"
              autoCorrect={false}
              value={city}
              onChangeText={setCity}
            /> */}

            <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                <View style={styles.buttonIcon}>
                    <Icon name="arrow-right" color="#FFF" size={24}/>
                </View>
                <Text style={styles.buttonText}>Entrar</Text>
            </RectButton>
          </View>

      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;