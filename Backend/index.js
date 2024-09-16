const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = { origin: "*", credentials: true, optionSuccessStatus: 200 };
const connectDB = require('./Config/db');
const authRoutes = require('./Routes/authRoutes');
const usersRoutes = require('./Routes/usersRoutes')


dotenv.config();

connectDB();

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes)


app.get("/", (req, res) => {
  res.status(200).json({
    team_name: "Mesho Devs", dev_team: ["Mesho", "Mesho254"].sort()
  });
});

app.use("*", (req, res) => {
  res.status(500).json({ status: "error", message: "This route does not exist" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});