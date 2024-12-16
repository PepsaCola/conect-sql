// Імпортуємо бібліотеку Axios для HTTP-запитів
const axios = require('axios').default;

// API ключ для доступу до Fortnite API
const APIkey = 'c88484bd-0350-4ba1-ac69-87af7578c429';

// Клас для роботи з косметикою LEGO
class GetLegoCosmetics {
    // Зберігаємо ключ API
    APIkey = APIkey;

    // Базовий URL для отримання косметики LEGO
    BASE_URL = 'https://fortnite-api.com/v2/cosmetics/lego';

    // Асинхронний метод для отримання даних про LEGO-косметику
    async getLego() {
        try {
            // Виконуємо GET-запит до API
            const response = await axios.get(`${this.BASE_URL}`);
            // Повертаємо отримані дані
            return response.data.data;
        } catch (error) {
            // Логування помилки у разі невдалого запиту
            console.log(error.message);
        }
    }
}

// Клас для роботи з косметикою автомобілів
class GetCarsCosmetics {
    APIkey = APIkey; // API ключ
    BASE_URL = 'https://fortnite-api.com/v2/cosmetics/cars'; // URL для запиту даних про автомобілі

    // Асинхронний метод для отримання даних про автомобілі
    async getCars() {
        try {
            const response = await axios.get(`${this.BASE_URL}`); // Виконуємо GET-запит
            return response.data.data; // Повертаємо отримані дані
        } catch (error) {
            console.log(error.message); // Логування помилки
        }
    }
}

// Клас для роботи з косметикою Battle Royale
class GetBRCosmetics {
    APIkey = APIkey; // API ключ
    BASE_URL = 'https://fortnite-api.com/v2/cosmetics/br'; // URL для запиту даних про косметику BR

    // Асинхронний метод для отримання даних про косметику BR
    async getBR() {
        try {
            const response = await axios.get(`${this.BASE_URL}`); // Виконуємо GET-запит
            console.log(response.data.data[0]); // Логування першого елемента даних (для перевірки)
            return response.data.data; // Повертаємо отримані дані
        } catch (error) {
            console.log(error.message); // Логування помилки
        }
    }
}

// Клас для роботи з музичними інструментами
class GetInstrumentsCosmetics {
    APIkey = APIkey; // API ключ
    BASE_URL = 'https://fortnite-api.com/v2/cosmetics/instruments'; // URL для запиту даних про інструменти

    // Асинхронний метод для отримання даних про інструменти
    async getInstruments() {
        try {
            const response = await axios.get(`${this.BASE_URL}`); // Виконуємо GET-запит
            console.log(response.data.data[0]); // Логування першого елемента даних (для перевірки)
            return response.data.data; // Повертаємо отримані дані
        } catch (error) {
            console.log(error.message); // Логування помилки
        }
    }
}

// Клас для роботи з музичними треками
class GetTracksCosmetics {
    APIkey = APIkey; // API ключ
    BASE_URL = 'https://fortnite-api.com/v2/cosmetics/tracks'; // URL для запиту даних про треки

    // Асинхронний метод для отримання даних про треки
    async getTracks() {
        try {
            const response = await axios.get(`${this.BASE_URL}`); // Виконуємо GET-запит
            console.log(response.data.data[0]); // Логування першого елемента даних (для перевірки)
            return response.data.data; // Повертаємо отримані дані
        } catch (error) {
            console.log(error.message); // Логування помилки
        }
    }
}

// Експортуємо всі класи для використання в інших модулях
module.exports = {
    GetLegoCosmetics, // Клас для LEGO-косметики
    GetCarsCosmetics, // Клас для автомобілів
    GetBRCosmetics, // Клас для Battle Royale косметики
    GetInstrumentsCosmetics, // Клас для музичних інструментів
    GetTracksCosmetics, // Клас для музичних треків
};
