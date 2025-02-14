import axios from 'axios';

export const getGeoLocationData = async () => {
 try {
  const response = await axios.get('https://ipapi.co/json/');
  return response.data;
 } catch (error) {
  console.error("Error fetching geolocation data", error);
  return null;
 }
};

export const fetchExchangeRates = async () => {
 try {
  const response = await axios.get('https://api.exchangeratesapi.io/latest?base=USD');
  console.log("response", response)
  return response.data.rates;
 } catch (error) {
  console.error("Error fetching exchange rates", error);
  return null;
 }
};