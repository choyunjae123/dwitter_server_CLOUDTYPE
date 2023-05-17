import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import tweetsRouter from './router/tweets.js'
import authRouter from './router/auth.js'
import {config} from './config.js' 
import {initSocket} from './connection/socket.js'
import {sequelize} from './db/database.js'

const app = express();

// 외부의 모든 사용자가 참여할 수 있도록 해주는 설정.
const corsOption = { 
    origin: config.cors.allowedOrigin,
    optionsSuccessStatus: 200
};

//미들웨어 
app.use(express.json());
app.use(cors(corsOption));
  // 사용자들이 접속하면 log를 콘솔에 찍음(HTTP 요청 로깅을 간단하게 처리하고자 할 때 사용)
app.use(morgan('tiny'));

// router
app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
    res.sendStatus(404)
})

// 서버에러
app.use((error, req, res, next) => {
    console.log(error)
    res.sendStatus(500)
});

// db.getConnection().then((connection)=>console.log(connection));

sequelize.sync().then(() => {    
    console.log(`서버가 시작되었음: ${new Date()}`) // 서버가 죽었다 살아날때마다 시간을 콘솔에 찍어주는 목적.
    const server = app.listen(config.host.port);
    initSocket(server);
});

