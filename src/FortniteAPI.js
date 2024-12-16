const axios = require('axios').default;

const APIkey = 'c88484bd-0350-4ba1-ac69-87af7578c429';

class GetLegoCosmetics {
  APIkey = APIkey;
  BASE_URL = 'https://fortnite-api.com/v2/cosmetics/lego';

  async getLego() {
    try {
      const response = await axios.get(`${this.BASE_URL}`);
      return response.data.data;
    } catch (error) {
      console.log(error.message);
    }
  }
}


class GetCarsCosmetics {
  APIkey = APIkey;
  BASE_URL = 'https://fortnite-api.com/v2/cosmetics/cars';
  async getCars(){
    try{
      const response = await axios.get(`${this.BASE_URL}`);

      return response.data.data;
    }catch(error) {
      console.log(error.message);
    }
  }
}

class GetBRCosmetics {
  APIkey = APIkey;
  BASE_URL = 'https://fortnite-api.com/v2/cosmetics/br';
  async getBR(){
    try{
      const response = await axios.get(`${this.BASE_URL}`);
      console.log(response.data.data[0]);
      return response.data.data;
    }catch(error) {
      console.log(error.message);
    }
  }
}

class GetInstrumentsCosmetics {
  APIkey = APIkey;
  BASE_URL = 'https://fortnite-api.com/v2/cosmetics/instruments';
  async getInstruments() {
    try{
      const response = await axios.get(`${this.BASE_URL}`);
      console.log(response.data.data[0]);
      return response.data.data;
    }catch(error) {
      console.log(error.message);
    }
  }
}

class GetTracksCosmetics {
  APIkey = APIkey;
  BASE_URL = 'https://fortnite-api.com/v2/cosmetics/tracks';
  async getTracks() {
    try{
      const response = await axios.get(`${this.BASE_URL}`);
      console.log(response.data.data[0]);
      return response.data.data;
    }catch(error) {
      console.log(error.message);
    }
  }
}

module.exports = {
  GetLegoCosmetics,
  GetCarsCosmetics,
  GetBRCosmetics,
  GetInstrumentsCosmetics,
  GetTracksCosmetics
};
