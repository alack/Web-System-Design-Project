/**
 * Created by jaehong on 2017. 11. 24..
 */
// 필요한 모듈들을 가져온다.
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
// mongoose
const mongoose = require('mongoose');
// 라우트를 받아온다.
const user = require('./server/routes/user');
const app = express();
// mongodb에 연결
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  // CONNECTED TO MONGODB SERVER
  console.log("Connected to mongod server");
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/web-system-design', { useMongoClient: true });
// POST 데이터 파싱 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// ng build 명령 실행시 생성되는 static 리소스 폴더 경로 및 이름 설정
app.use(express.static(path.join(__dirname, 'dist')));

// user
app.use('/user', user);

// 모든 경로에 대한 라우터 설정 및 반환 파일 경로 설정
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


// Port 설정
const port = process.env.PORT || '3000';
app.set('port', port);

// HTTP 서버 생성
const server = http.createServer(app);

// 설정된 포트로 서버가 요청 대기
server.listen(port, function () {
  console.log(`Express running on localhost:${port}`);
});
