import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import config from "./config";
import userRouter from "./routers/UserRoutes";
import OrderRouter from "./routers/OrderRouter"
import productRouter from './routers/productRouter';
import uploadRouter from './routers/uploadRouter';
import path from 'path';

const app = express();
mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connect to mongodb");
  })
  .catch((error) => {
    console.log(error.reason);
  });
app.use(cors());
app.use(bodyParser.json())
app.use('/api/uploads', uploadRouter)
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/paypal/clientId', (req,res)=>{
  res.send({clientId:config.PAYPAL_CLIENT_ID})
})

app.use('/uploads', express.static(path.join(__dirname,'/../uploads')));
app.use(express.static(path.join(__dirname, '/../frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../frontend/index.html'));
});
app.use((err,req,res,next)=>{
  const status = err.name && err.name ==='ValidationError'? 400 : 500;
  res.status(status).send({ message:err.message})
  
})
app.listen(config.PORT, () => {
  console.log("server at http://localhost:5000");
});