const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
let port = 5001;

// --- In-memory "database" ---
// In a real app, use a proper database (MongoDB, PostgreSQL, etc.)
const users = [];
let userIdCounter = 1;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing JSON request bodies

// --- Secret for JWT ---
// IMPORTANT: In a real application, store this securely (e.g., environment variable)
const JWT_SECRET = 'your-very-secret-key-here-CHANGE-ME'; // Added a reminder to change this

// Serve static files from the project root
app.use(express.static(path.join(__dirname)));

// --- Routes ---

// Registration Endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Create new user object
    const newUser = {
      id: userIdCounter++,
      username: username,
      password: hashedPassword, // Store the hashed password
    };

    // Add user to our "database"
    users.push(newUser);
    console.log('User registered:', newUser.username); // Log for debugging

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Find user in our "database"
  const user = users.find(u => u.username === username);

  if (!user) {
    // Security: Use a generic message for both wrong username and password
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  try {
    // Compare submitted password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Security: Use a generic message
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Passwords match - generate a JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username
        // Add other relevant user data if needed, but avoid sensitive info
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) {
          console.error('Error signing token:', err);
          return res.status(500).json({ message: 'Error generating token.' });
        }
        console.log(`User logged in: ${user.username}`); // Log for debugging
        res.json({
          message: 'Login successful!',
          token: token, // Send the token to the client
          user: { // Send back some basic user info (optional)
            id: user.id,
            username: user.username
          }
        });
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// Fallback: Serve index.html for all unmatched routes (useful for single-page apps)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function startServer() {
    const server = app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${port} is in use, trying port ${port + 1}`);
            port++;
            setTimeout(startServer, 1000);
        } else {
            console.error('Server error:', err);
            process.exit(1);
        }
    });
}

startServer(); 