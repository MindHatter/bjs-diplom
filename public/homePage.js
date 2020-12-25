'use strict';
const userLogout = new LogoutButton();

userLogout.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    });
};

ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const newRates = new RatesBoard(); 

const getCourses = () => {
    ApiConnector.getStocks(response => {
        if (response.success) {
            newRates.clearTable();
            newRates.fillTable(response.data);
        }
    });
};
getCourses();

let updateCourses = setInterval(getCourses, 60000);
const userMoneyManager = new MoneyManager();

userMoneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            userMoneyManager.setMessage(response.success, 'Счёт успешно пополнен');
        }
        else {
            userMoneyManager.setMessage(response.success, response.error);
        }
    });
};

userMoneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            userMoneyManager.setMessage(response.success, 'Валюта успешно конвертирована');
        }
        else {
            userMoneyManager.setMessage(response.success, response.error);
        }
    });
};

userMoneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            userMoneyManager.setMessage(response.success, 'Перевод выполнен успешно');
        }
        else {
            userMoneyManager.setMessage(response.success, response.error);
        }
    });
};

const newFavorit = new FavoritesWidget();

const getFavorites = () => {
    ApiConnector.getFavorites(response => {
        if (response.success) {
            newFavorit.clearTable();
            newFavorit.fillTable(response.data);
            userMoneyManager.updateUsersList(response.data);
        }
    });
};

getFavorites();

newFavorit.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            userMoneyManager.setMessage(response.success, 'Пользователь добавлен в список Избранное');
            getFavorites();
        }
        else {
            userMoneyManager.setMessage(response.success, response.error);
        }
    });
};

newFavorit.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            userMoneyManager.setMessage(response.success, 'Пользователь удален из списка Избранное');
            getFavorites();
        }
        else {
            userMoneyManager.setMessage(response.success, response.error);
        }
    });
};