const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {

    res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.inputEmail;

    const data = {
        members: [
            {   
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us18.api.mailchimp.com/3.0/lists/ba680897dd";

    const options = {
        method: "POST",
        auth: "ryan:fa09d536646077d23436ae179b97c799-us18"
    }

    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            // console.log(JSON.parse(data));
            console.log("hello");
            console.log(response.statusCode);
        });
        
        if (response.statusCode == "200") {
            res.redirect("/success");
            
        } else {
            res.redirect("/failure");
            
        }
    });


    request.write(jsonData);
    request.end();

});

app.get("/success", function(req, res) {
    res.sendFile(__dirname + "/success.html");
});

app.get("/failure", function(req, res) {
    res.sendFile(__dirname + "/failure.html");
});

app.post("/success", function(req, res) {
    res.redirect("/");
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Listening");
});

//Mailchimp API Key
//different now in Glitch to stop mailchimp from turning off API Key
//fa09d536646077d23436ae179b97c799-us18

//Mailchimp List ID
//ba680897dd