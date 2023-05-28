const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8tifwil.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const usersCollection = client.db("Login-user").collection("users");


    // add users data on usersCollection 

    app.post("/singup", async (req, res) => {
      const user = req.body;
      const email = user.email;

      // Server-side validation
      if (!user.name || !user.email || !user.password) {
        return res.status(400).json({ error: "Please fill in all fields." });
      }

      // Simple email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        return res.status(400).json({ error: "Please provide a valid email address." });
      }

      const passwordRegex  = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      if(!passwordRegex.test(user.password)){
        return res.status(400).json({ error: "password should at least 6 character and contain at least one number and one special character" });
      }
      const query = { email };
      const exitingUser = await usersCollection.findOne(query);
        if(exitingUser && user.email === exitingUser.email){
            return res.status(400).json({ error: "Email is already used try to login" });
        }
      const result = await usersCollection.insertOne(user);
      res.send(result);

    });


    app.post("/login", async(req, res)=>{
        const user = req.body;
        const email  = user.email;

        // Server-side validation
      if (!user.email || !user.password) {
        return res.status(400).json({ error: "Please fill in all fields." });
      }

      // Simple email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        return res.status(400).json({ error: "Please provide a valid email address." });
      }

      const query = { email };
      const exitingUser = await usersCollection.findOne(query);


      if(user.password != exitingUser.password){
        return res.status(400).json({ error: "Your password is wrong" });
      }

      res.status(200).json({success: "Login successful"})

    })





  } finally {
  }
}

run().catch((error) => {
  console.log(error.message);
});

app.get("/", (req, res) => {
  res.send("User login server running");
});

app.listen(port, () => {
  console.log(`i am running on port ${port}`);
});
