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

function financialTransactions(response){
    if(response.success === true) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success, 'Операция успешно выполнена');
    } else {
        moneyManager.setMessage(response.success, response.error);
    }  
}

moneyManager.addMoneyCallback = data => ApiConnector.addMoney(data, financialTransactions);
moneyManager.conversionMoneyCallback = data => ApiConnector.convertMoney(data, financialTransactions);
moneyManager.sendMoneyCallback = data => ApiConnector.transferMoney(data, financialTransactions);

//
const favoritesWidget = new FavoritesWidget;

ApiConnector.getFavorites(response => {
    if(response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

function editFavorites(response){
    if(response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favoritesWidget.setMessage(response.success, 'Список избранного отредактирован');
    } else {
        favoritesWidget.setMessage(response.success, response.error);
    }
}

favoritesWidget.addUserCallback = data => ApiConnector.addUserToFavorites(data, editFavorites);
favoritesWidget.removeUserCallback = data => ApiConnector.removeUserFromFavorites(data, editFavorites);