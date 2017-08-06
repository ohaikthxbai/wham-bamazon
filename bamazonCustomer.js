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
            console.log("*********************************************");
            console.log("");
            console.log("Dis Wham-Bamazon Catalog: ");
            console.log("");
            // iterate through data and display it (cleaner way to display table data???)
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
            console.log("");
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
            // validate returns truef the entry is valid, otherwise throw error
            validate: function(entry) {
                // fine accepted value as the validated number
                var accepted = !isNaN(entry);
                // return the accepted value or prompt for the proper response
                return accepted || "Please enter a number value: ";
            }
        },
        {
            // How many would you like?
            type: "input",
            name: "quantity",
            message: "How many would you like to purchase? ",
            // validate returns truef the entry is valid, otherwise throw error
            validate: function(entry) {
                // fine accepted value as the validated number
                var accepted = !isNaN(entry);
                // return the accepted value or prompt for the proper response
                return accepted || "Please enter a number value: ";
            }
        }
    ]).then(function(userInput) {
        // run inventory check with provided parameters
        inventoryCheck(userInput.id, userInput.quantity);
    });
}

// query databse for the user's input and quantity
function inventoryCheck(id, quantity) {
    // testing
    //console.log("ID selected: " + id);
    //console.log("Quantity selected: " + quantity);
    // instead of selecting all, choose only the quantity where the id is selected
    var query = "SELECT stock_quantity, price FROM products WHERE ?";

    connection.query(query,{item_id: id}, function(error, res) {
        if (error) {
            console.log("Something went wrong in the inventoryCheck function");
            throw error;
        }
        else {
            // grabbed from afterConnection function; changing variable names
            //console.log(res);
            // stringify JSON for legibility - tested; works
            inventoryString = JSON.stringify(res,null,2);
            //console.log(sqlToString);
            // parsing the stringified data
            inventoryJSON = JSON.parse(inventoryString);
            //test
            //console.log("Current Stock: " + inventoryJSON[0].stock_quantity);
            currentStock = inventoryJSON[0].stock_quantity;
            currentPrice = inventoryJSON[0].price;
            console.log("Item Price: " + currentPrice);
            console.log("Total Cost: " + currentPrice * quantity);
            // update the database if the current inventory has more or equal to the requested quantity
            if (currentStock >= quantity) {
                // set new SQL query
                var update = "UPDATE products SET ? WHERE ?";
                connection.query(update, [{stock_quantity: currentStock - quantity}, {item_id: id}],
                function(error, res) {
                    // status update
                    console.log("");
                    console.log("Inventory Updated!");
                    console.log("");
                    // display the update catalog
                    
                    afterConnection();
                });
            } 
            else {
                // if the quantity requested is less than the current stock
                console.log("Insufficient Quantity!");
            }
        }
    });
}
