const logoutButton = new LogoutButton();

logoutButton.action = () => ApiConnector.logout(response => response.success === true ? location.reload() : null);

//

ApiConnector.current(response => response.success === true ? ProfileWidget.showProfile(response.data) : null);

//

const ratesBoard = new RatesBoard();

function getStocks(){
    ApiConnector.getStocks(response => {
        if(response.success === true) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}

getStocks();

setInterval(getStocks, 60000);

//

const moneyManager = new MoneyManager;

moneyManager.addMoneyCallback = data => ApiConnector.addMoney(data, 
    response => {
        if(response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, `Кошелек успешно пополнен на сумму ${data.amount} ${data.currency}`);
        } else {
            moneyManager.setMessage(response.success, response.error);
    }           
});

moneyManager.conversionMoneyCallback = data => ApiConnector.convertMoney(data, 
    response => {
        if(response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, `${data.fromAmount} ${data.fromCurrency} успешно сконвертированы в ${data.targetCurrency}`);
        } else {
            moneyManager.setMessage(response.success, response.error);
    }           
});

moneyManager.sendMoneyCallback = data => ApiConnector.transferMoney(data, 
    response => {
        if(response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, 'Деньги успешно отправлены');
        } else {
            moneyManager.setMessage(response.success, response.error);
    }           
});

//

const favoritesWidget = new FavoritesWidget;

ApiConnector.getFavorites(response => {
    if(response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

favoritesWidget.addUserCallback = data => ApiConnector.addUserToFavorites(data, response => {
    if(response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favoritesWidget.setMessage(response.success, 'Пользователь добавлен');
    } else {
        favoritesWidget.setMessage(response.success, response.error);
    }
});

favoritesWidget.removeUserCallback = data => ApiConnector.removeUserFromFavorites(data, response => {
    if(response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favoritesWidget.setMessage(response.success, 'Пользователь удален');
    } else {
        favoritesWidget.setMessage(response.success, response.error);
    }
});