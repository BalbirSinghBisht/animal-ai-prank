
require('dotenv').config();
const express=require('express');
const path=require('path');
const cors=require('cors');
const {Pool}=require('pg');

const app=express();
app.use(cors());
app.use(express.json());

const pool=new Pool({
 host:process.env.DB_HOST,
 port:process.env.DB_PORT,
 database:process.env.DB_NAME,
 user:process.env.DB_USER,
 password:process.env.DB_PASSWORD,
 ssl: {
    rejectUnauthorized: false
  }
});

app.post('/api/visitor',async(req,res)=>{
 const {username,password,nickname}=req.body;
 const r=await pool.query(
 'insert into visitors(username,password,nickname) values($1,$2,$3) returning id',
 [username,password,nickname]
 );
 res.json(r.rows[0]);
});

app.post('/api/answer', async (req, res) => {
  const {
    visitor_id,
    question_no,
    answer
  } = req.body;

  await pool.query(
    `
      INSERT INTO answers
      (
        visitor_id,
        question_no,
        answer
      )
      VALUES ($1,$2,$3)
    `,
    [
      visitor_id,
      question_no,
      answer
    ]
  );

  res.json({
    success: true
  });
});

const path = require('path');

app.use(
  express.static(
    path.join(__dirname, '../client/dist')
  )
);

app.get('*', (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      '../client/dist/index.html'
    )
  );
});

app.listen(process.env.PORT || 5000,()=>console.log('running'));
