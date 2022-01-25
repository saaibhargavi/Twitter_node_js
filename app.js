const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const databasePath = path.join(__dirname, "twitterClone.db");
const app = express();
app.use(express.json());
let database = null;

const initilizingdbAndserver = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error :{error.message} `);
    process.exit(1);
  }
};

initilizingdbAndserver();

const validatepassword = (password) => {
    return password.length > 6
};

app.post("/register/",async(request,response) =>{
    const {username,password,name,gender} = request.body;
    const hashedpassword = await bcrypt.hash(password,10);
    const SelectUserQuery = `SELECT* FROM User WHERE username = '${username}';`;
    const databaseUser = await database.get(SelectUserQuery);

    if (databaseUser === undefined){
        const creatUserQuery = `INSERT INTO user (username,hashedpassword,name,gender)
         values('${username}','${password}','${name}','${gender}';)`;
    
    if (validatepassword(password)){
        await database.run(creatUserQuery);
        response.status('200');
        response.send("User created successfully");
    }else{
        response.status('400');
        response.send("Password is too short");
    }
 } else{
        response.status('400');
        response.send("User already exists");

});

//API 2
Path: /login/

app.post("/login/",async(request,response)=>{
    const {usename,password} = request.body;
    const SelectQuery = `SELECT * FROM user WHERE username:'${username}';`; 
    const databaseUser = await database.get("SelectQuery");
    if (databaseUser == undefined){
        response.status('400');
        response.send("Invalid User");

    }else{
       const isPasswordMatch = await bcrypt.compare(password,database.password);
       if (isPasswordMatch == true){
           const payload = {
                username:username,
           };
           const jwtToken = jwt.sign(payload,"MY_SECRET_KEY");
           Response.send({jwtToken});
       }else{
           response.status('400');
           response.send("Invalid user");
       }

    }
});


