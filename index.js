const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const e = require('express');
const app = express();
const methodOverride = require("method-override");
const path = require("path");


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "/views"));

const connection  = mysql.createConnection({
  host: 'localhost',
  user : 'root',
  database: 'delta_app',
  password:'sangita@dinda@0'
});

let getRandomUser = () => {
  return [
     faker.string.uuid(),
     faker.internet.username(), // before version 9.1.0, use userName()
     faker.internet.email(),
     faker.internet.password(),
    
  ];
};

// let data=[];

// for(let i=0;i<100;i++){
//   data.push(getRandomUser());
// }

// let users = [[124, "124_random","random4@gmail.com","random@124"],
//              [125, "125_random","random5@gmail.com","random@125"]
//             ];






//home route
app.get("/", (req, res)=>{
  let q = `SELECT count(*) FROM user`;

  try{
    connection.query(q, (err,result)=>{
      if(err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs",{count});
    });
  }catch(err){
    console.log(err);
    res.send("Some error present");
  }
})
//users route
app.get("/users", (req, res)=>{
  let q = `SELECT * FROM user`;

  try{
    connection.query(q, (err,result)=>{
      if(err) throw err;
      // let data = result;
      // console.log(result);
      res.render("users.ejs",{result});
      // res.send(result);
    });
  }catch(err){
    console.log(err);
    res.send("Some error present");
  }
})

//edit route
app.get("/user/:id/edit" , (req, res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try{
    connection.query(q, (err,result)=>{
      if(err) throw err;
      let user = result[0];
      res.render("editform.ejs",{user});
      // res.send(result);
    });
  }catch(err){
    console.log(err);
    res.send("Some error present");
  }
})
//update route
app.patch("/user/:id", (req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  let { username : newusername, password: frompassword} = req.body;

  try{
    connection.query(q, (err,result)=>{
      if(err) throw err;
      let user = result[0];
      if(frompassword != user.password){
        res.send("WRONG PASSWORD!!");
      }else{
          let q2 = `UPDATE user SET username='${newusername}' WHERE id = '${id}'`;
          try{
            connection.query(q2, (err,result)=>{
              if(err) throw err;
              res.redirect("/users");
            });
          }catch(err){
            console.log(err);
            res.send("Some error present");
          }
      }
      
    });
  }catch(err){
    console.log(err);
    res.send("Some error present");
  }
});



//delete update try
app.get("/user/:id/delete" , (req, res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try{
    connection.query(q, (err,result)=>{
      if(err) throw err;
      let user = result[0];
      res.render("deleteform.ejs",{user});
      // res.send(result);
    });
  }catch(err){
    console.log(err);
    res.send("Some error present");
  }
})


app.patch("/user/:id/remove", (req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  let { password: frompassword} = req.body;

  try{
    connection.query(q, (err,result)=>{
      if(err) throw err;
      let user = result[0];
      if(frompassword != user.password){
        res.send("WRONG PASSWORD!!");
      }else{
          let q2 = `DELETE FROM user WHERE id = '${id}'`;
          try{
            connection.query(q2, (err,result)=>{
              if(err) throw err;
              res.redirect("/users");
            });
          }catch(err){
            console.log(err);
            res.send("Some error present");
          }
      }
      
    });
  }catch(err){
    console.log(err);
    res.send("Some error present");
  }
});

//add user

app.get("/add", (req, res) => {
    res.render("addform.ejs");
});

app.post("/add/success", (req,res)=>{
  let {id : newid, username : newusername, password: frompassword,email : newmail} = req.body;
  let q =`INSERT INTO user (id, username,email, password ) VALUES ('${newid}', '${newusername}','${newmail}','${frompassword}')`;

  try{
    connection.query(q, (err,result)=>{
      if(err) throw err;
      res.redirect("/users");
    });
  }catch(err){
    console.log(err);
    res.send("Some error present");
  }
});


//res.redirect("/users");



app.listen("8080",()=>{
  console.log("Server is lisining the port 8080");
});

// let q = "INSERT INTO user(id,username,email,password) VALUES ?";

// try{
//   connection.query(q,[data], (err, result ) => {
//   if (err) throw err;
//   console.log(result);
//   console.log(result.length);
//   console.log(result[0]);
// });
// } catch (err){
//   console.log(err);
// }
// connection.end();





