const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const eventRouter = require('./routes/eventRouter')
const searchRouter = require('./routes/searchRouter')
const commentRouter = require('./routes/commentRouter')
const organizationRouter = require('./routes/orgRouter')
const purchaseRouter = require('./routes/purchaseRouter')

const cors = require('cors')
const authMid = require('./middleware/authMiddleware')


const PORT = process.env.PORT || 8080
const app = express()

const errorHandler = async (err, req, res, next) => {
  if(err) console.log(err);
  next();
};

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload());

app.use(cors({origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser())

app.use('/api', authRouter,errorHandler);

app.use(authMid);

app.use('/api', userRouter,errorHandler);
app.use('/api', eventRouter,errorHandler);
app.use('/api', searchRouter,errorHandler);
app.use('/api', organizationRouter,errorHandler);
app.use('/api', commentRouter,errorHandler);
app.use('/api', purchaseRouter,errorHandler);


app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))
