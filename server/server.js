import express from 'express';
import mysql2 from 'mysql2/promise';
import cors from 'cors';
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json())
app.options('*', cors());

// MYSQL Connection
var conn;
(async ()=>{
  try {
    conn = await mysql2.createConnection({
      host:'localhost',
      user:'root',
      password:'Roshi@#321',
      port: 3306,
      database: 'ai_assist'
    });
    console.log("Database connection established...");
    await conn.execute('CREATE DATABASE IF NOT EXISTS ai_assist;');
    const sql = `CREATE TABLE IF NOT EXISTS chat_instances(instance_id VARCHAR(255) PRIMARY KEY,topic_message LONGTEXT NOT NULL,active BOOLEAN NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
    try {
      await conn.query(sql);
      console.log("Table is created");
    } catch (err) {
      console.log("Error in creating table",err);
    }
  } 
  catch (err) {
    console.error("Error in database connection: ", err);
  }
})();


// HTTP Requests

// GET Requests
app.get('/',(req,res)=>{
  res.send("hello");
})

//Getting the chats according to the instance id
app.get('/chat/:slug',async (req,res)=>{
  const { slug: instance_id } = req.params;
  const sql = `SELECT * FROM ?? ORDER BY timestamp ASC`;
  try{
    const [results] = await conn.query(sql,[`chat_${instance_id}`]);
    res.json(results);
  }
  catch(err){
    console.log("Error..");
    res.status(500).send('Internal Server Error');
  }
});

//Getting all the instances
app.get('/all_instance',async (req,res)=>{
  const sql = `SELECT * FROM chat_instances ORDER BY timestamp ASC`;
  try{
    const [results] = await conn.query(sql);
    res.json(results);
  }
  catch(err){
    console.log("Error..");
    res.status(500).send('Internal Server Error');
  }


});


//POST Requests

//For New Chat
app.post('/newchat/:slug', async (req, res) => {
  const { slug: instance_id } = req.params;
  const sql = `CREATE TABLE IF NOT EXISTS ??(chat_id VARCHAR(255) PRIMARY KEY,chat_message LONGTEXT NOT NULL,is_human BOOLEAN NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
  try {
    await conn.query(sql,[`chat_${instance_id}`]);
    console.log("Table is created",instance_id);
  } catch (err) {
    console.log("Error in creating table",err) 
    res.status(500).send('Internal Server Error');
  }
  res.sendStatus(200);
})

//For New Instance
app.post('/instance/:slug', async (req, res) => {
  const { slug: instance_id } = req.params;
  const {topic,is_active} = req.body;
  const sql = `INSERT INTO chat_instances(instance_id,topic_message,active) VALUES (?,?,?);`;
  try {
    await conn.query(sql,[instance_id,topic,is_active]);
    console.log("Inserted in the instance",instance_id);
  } catch (err) {
    console.log("Error in inserting in the instance",err);
    res.status(500).send('Internal Server Error');
  }
  res.sendStatus(200);
})

//
app.post('/instance_topic/:slug', async (req, res) => {
  const { slug: chat_active_id } = req.params;
  const {topic} = req.body;
  const sql = `UPDATE chat_instances SET topic_message = '${topic}' WHERE instance_id = '${chat_active_id}';`;
  try {
    await conn.query(sql);
    console.log("Updated");
  } catch (err) {
    console.log("Error in Updation in the instance",err);
    res.status(500).send('Internal Server Error');
  }
  res.sendStatus(200);
})

app.post('/instance_delete/:slug', async (req,res)=>{
  const { slug: instance_id } = req.params;
  const sql = `DELETE FROM chat_instances WHERE instance_id = '${instance_id}';`;
  try {
    await conn.query(sql);
    console.log("Deleted");
  } catch (err) {
    console.log("Error in Deletion the instance",err);
    res.status(500).send('Internal Server Error');
  }

  let query = `DROP TABLE chat_${instance_id};`;
  try {
    await conn.query(query);
    console.log("Deleted");
  } catch (err) {
    console.log("Error in Deletion the instance",err);
    res.status(500).send('Internal Server Error');
  }

  res.sendStatus(200);
})


app.post('/go/:slug', async(req, res) => {
  const { slug: chat_active_id } = req.params;
  const {id,message,is_human} = req.body;
  const sql = `INSERT INTO chat_${chat_active_id}(chat_id, chat_message, is_human) VALUES (?,?,?)`
  try {
    await conn.query(sql,[id,message,is_human]);
    console.log("Data inserted...",chat_active_id);
  } catch (err) {
    console.log("Error in Insertion",err);
    res.status(500).send('Internal Server Error');
  }
  res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
