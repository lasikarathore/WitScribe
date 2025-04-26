const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/WitScribe', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to WitScribe database');
}).catch((err) => {
  console.log('Error connecting to database', err);
});

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  otp: {
    code: String,
    expiry: Date,
  },
  date: { type: Date, default: Date.now },
});

const User = mongoose.model('users', UserSchema);

// Middleware
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Session setup
app.use(session({
  secret: 'witscribe-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/WitScribe',
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 28 * 24 * 60 * 60 * 1000, // 28 days
    secure: false, // set true if using https
    httpOnly: true
  }
}));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'witscribe@gmail.com',
    pass: 'hxfw cxno qrmb esgu'
  }
});

// Helpers
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, name, otp) {
  try {
    const mailOptions = {
      from: 'witscribe@gmail.com',
      to: email,
      subject: 'WitScribe - Your Email Verification Code',
      html: `
        <div>
          <h2>Hello ${name}!</h2>
          <p>Your verification code is:</p>
          <h1>${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

// Middlewares
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ success: false, message: "Not logged in" });
};

const isVerified = async (req, res, next) => {
  const user = await User.findById(req.session.userId);
  if (user && user.isVerified) return next();
  return res.status(403).json({ success: false, message: "Email not verified" });
};

// Routes
app.get("/", (req, res) => res.send("Server is working"));

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60000);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      otp: { code: otp, expiry }
    });

    const sent = await sendOTPEmail(email, name, otp);
    if (!sent) {
      return res.status(500).json({ success: false, message: "OTP email failed" });
    }

    res.status(200).json({
      success: true,
      message: "Registered. Check email for verification code.",
      data: { id: newUser._id }
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.otp.code === otp && user.otp.expiry > new Date()) {
      user.isVerified = true;
      user.otp = undefined;
      await user.save();

      req.session.userId = user._id;
      req.session.save();

      return res.status(200).json({ success: true, message: "Email verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
  } catch (err) {
    console.error("OTP error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60000);
    user.otp = { code: otp, expiry };
    await user.save();

    const sent = await sendOTPEmail(email, user.name, otp);
    if (!sent) {
      return res.status(500).json({ success: false, message: "Failed to resend OTP" });
    }

    res.status(200).json({ success: true, message: "OTP resent" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ success: false, message: "Invalid credentials" });

    if (!user.isVerified) return res.status(403).json({ success: false, message: "Email not verified", userId: user._id });

    req.session.userId = user._id;
    req.session.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, message: "Logout failed" });
    res.clearCookie('connect.sid');
    res.status(200).json({ success: true, message: "Logged out" });
  });
});

app.get("/profile", isAuthenticated, isVerified, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password -otp');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
