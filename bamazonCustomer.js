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
var sqlJSON = "";

// connecting to the databse
connection.connect(function(error) {
    if (error) {
        throw error;
        console.log("Something went wrong while trying to connect to the database.");
    }
    else {
        //console.log('connect as id' + connection.threadId);
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
            //console.log(sqlToString);
            // parsing the stringified data
            sqlJSON = JSON.parse(sqlToString);
            //test
            //console.log(sqlJSON);
            // iterate through data and display it (cleaner way to display table data???)
            console.log("");
            console.log("Bamazon Catalog: ");
            console.log("");
            for (i = 0; i < sqlJSON.length; i++) {
                console.log(
                    sqlJSON[i].item_id, 
                    sqlJSON[i].product_name, 
                    "$" + sqlJSON[i].price, 
                    sqlJSON[i].stock_quantity
                );
            }
            // run function
            console.log("");
            console.log("*********************************************");
            customerPrompt();
        }
    });
}

// prompt user for their item and quantity request
function customerPrompt() {
    inquirer.prompt([
        {
            // What item would you like to purchase? (ID)
            type: "input",
            name: "id",
            message: "Enter the ID number of the product you would like to purchase: ",
            validate: function(entry) {
                // check if input is a number
                if (isNaN(entry)) {
                    return "Please enter a number for the ID: "
                }
            }
        }
        // {
        //     // How many would you like?
        //     type: "input",
        //     name: "quantity",
        //     message: "How many would you like to purchase? ",
        //     validate: function(entry) {
        //         if (isNaN(entry)) {
        //             return "Please enter a number for the quantity: "
        //         }
        //     }
        // }
    ]);
}