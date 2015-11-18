var app = angular.module('app', [ 'ngRoute' ]);

app.config(function configure($routeProvider) {
    $routeProvider
    .when('/', { controller: 'CustomersController', templateUrl: './templates/customers.html' })
    .when('/customer/:id', { controller: 'CustomerController', templateUrl: './templates/customer.html' })
    .otherwise({ redirect: '/' });
});

app.factory('Data', function Data($http) {
    return {
        getCustomers: function getCustomers() { return $http.get('/angular-laravel/public/customers/all')},
        getCustomer: function getCustomer(id) { return $http.get('/angular-laravel/public/customers?id='+id); },
        addCustomer: function addCustomer(data) { return $http.post('/angular-laravel/public/customers',data); },
        getTransactions: function getTransactions(id) { return $http.get('/angular-laravel/public/transactions?id='+id); },
        addTransaction: function addTransaction(data) { return $http.post('/angular-laravel/public/transactions',data); },
        removeTransaction: function removeTransaction(id) { return $http.delete('/angular-laravel/public/transactions?id='+ id); },
        removeCustomer: function removeCustomer(id) { return $http.delete('/angular-laravel/public/customers?id='+ id); }
    }
});

app.controller('CustomersController', function CustomersController($scope, Data) {
    Data.getCustomers().success(parseCustomers);

    function parseCustomers(data) {
        $scope.customers = data;
    }

    $scope.newCustomer = { name: '', email: '' };

    $scope.addCustomer = function addCustomer() {
        var names = $scope.newCustomer.name.split(' ');
        Data.addCustomer({
            first_name: names[0],
            last_name: names[1],
            email: $scope.newCustomer.email
    })
    .success(customerAddSuccess).error(customerAddError);
};

function customerAddSuccess(data) {
    $scope.error = null;
    $scope.customers.push(data);
    $scope.newCustomer = { name: '', email: '' };
}

function customerAddError(data) {
    $scope.error = data;
}

$scope.removeCustomer = function removeCustomer(id) {
    if (confirm('Do you really want to remove this customer?')) {
        Data.removeCustomer(id).success(customerRemoveSuccess);
    }
};

function customerRemoveSuccess(data) {
    var i = $scope.customers.length;
    while (i--) {
        if ($scope.customers[i].id == data) {
            $scope.customers.splice(i, 1);
        }
    }
}
});

app.controller('CustomerController', function CustomerController($scope, $routeParams, Data) {
    Data.getCustomer($routeParams.id).success(parseCustomer);

    function parseCustomer(data) {
        $scope.customer = data;
    }

    Data.getTransactions($routeParams.id).success(parseCustomersTransactions);

    function parseCustomersTransactions(data) {
        $scope.transactions = data;
        $scope.sum = 0;
        for (var k in data) {
            $scope.sum += parseFloat(data[k].amount);
        }
    }

    $scope.newTransaction = { name: '', amount: 0 };

    $scope.addTransaction = function addTransaction() {
        $scope.newTransaction.customer_id = $scope.customer.id;
        Data.addTransaction($scope.newTransaction).success(transactionAddSuccess).error(transactionAddError);
    }

    function transactionAddSuccess(data) {
        $scope.error = null;
        data.amount = parseFloat(data.amount);
        $scope.transactions.push(data);

        $scope.sum += data.amount;
        $scope.newTransaction = { name: '', amount: 0 };
    }

    function transactionAddError(data) {
        $scope.error = data;
    }

    $scope.removeTransaction = function removeTransaction(id) {
        if (confirm('Do you really want to remove this transaction?')) {
            Data.removeTransaction(id).success(transactionRemoveSuccess);
        }
    }

    function transactionRemoveSuccess(data) {
        var i = $scope.transactions.length;
        while (i--) {
            if ($scope.transactions[i].id == data) {
                $scope.sum -= $scope.transactions[i].amount;
                $scope.transactions.splice(i, 1);
            }
        }
    }
});