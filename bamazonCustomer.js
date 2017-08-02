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
port: 8889,                 // "door"
user: 'root',               // username
password: 'root',           // password
database: 'bamazon_db'      // specific database
}

// create the connection
var connection = mysql.createConnection(config);

// this is why you take notes
// declare query so rest of the code is easily legible
var query = "SELECT * FROM products";

// testing db data, possibly convert to json?
var sqlToString = "";

// connecting to the databse
connection.connect(function(error) {
    if (error) {
        throw error;
        console.log("Something went wrong while trying to connect to the database.");
    }
    else {
        console.log('connect as id' + connection.threadId);
        afterConnection();
    }
});

// test and display sql data
function afterConnection() {
    connection.query(query, function(error, res) {
        if (error) {
            throw error;
            console.log("Something went wrong in the afterConnection function");
        }
        else {
            //console.log(res);
            // stringify JSON for legibility - tested; works
            sqlToString = JSON.stringify(res,null,2);
            //console.log(sqlToString;
            //
        }
    });
}
