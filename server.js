const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const usersRouter = require('./routes/users'); 
app.use('/users', usersRouter);
const studentsRouter = require('./routes/students'); 
app.use('/students', studentsRouter);
port=5000;
const db = require('./config/db');


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  
  db.query(query, [email, password], (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      res.status(401).json({ message: 'Invalid email or password' });
    } else {
      const user = result[0];
      res.json({ role: user.role, userId: user.id });
    }
  });
});


app.get('/user', (req, res) => {
  const role = req.query.role;

  if (role === 'student') {
    res.send('Welcome, Student!');
  } else if (role === 'teacher') {
    res.send('Welcome, Teacher!');
  } else if (role === 'admin') {
    res.send('Welcome, Admin!');
  } else {
    res.status(404).send('Page not found');
  }
});

// Signup 
app.post('/signup', (req, res) => {
    const { name, email, password, role } = req.body;
  
    if (!name || !email || !password || !role) {
      res.status(400).json({ message: 'Please fill in all fields' });
      return;
    }
  
 
    const checkQuery = `SELECT * FROM users WHERE email = ?`;
    db.query(checkQuery, [email], (err, result) => {
      if (err) throw err;
  
      if (result.length > 0) {
        res.status(400).json({ message: 'Email already exists' });
      } else {
   
        const createUserQuery = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
        db.query(createUserQuery, [name, email, password, role], (err, result) => {
          if (err) throw err;
          res.json({ message: 'User created successfully!' });
        });
      }
    });
  });



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
