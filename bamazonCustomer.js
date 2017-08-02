// prompt users with two messages
// 1: ask user for product id for purchase
// 2: ask for the quantity 

// application checks inventory for requested product
// if request cannot be met, 
// display message "insufficient quantity!"
// cancel the request
// if request CAN be met,
// fulfill the order: 
// update the db to display the remaining quantity
// once updated display the total cost

// declaring npm packages
// accidentally installed the 'sql' module... oops
var mysql = require("mysql");
var inquirer = require("inquirer");

// create configuration
var config = {
host: 'localhost',          // "house"
port: 3306,                 // "door"
user: 'root',               // username
password: 'root',           // password
database: 'bamazon_db'      // specific database
}

// create the connection
var connection = mysql.createConnection(config);