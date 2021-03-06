var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");

// https로 클라이언트가 배포될경우 서버도 https로 전환해야할 가능성 있음.
router.get("/", function (req, res, next) {
  res.send("test");
});

// multer를 이용해 메모리 저장공간 (버퍼)로 저장 업로드 시킴.
// single("file") => 해당 공간에 file이라는 이름을 가진 파일을 버퍼 형태로 저장 시키는 것
const upload = multer({
  storage: multer.memoryStorage(),
}).single("file");
// https 서버에서 오는 req 요청 제대로 수행하지 못함 이부분 해결해야함.
//  그러기 위해서는 서버를 두개의 포트로 열어야할듯.
// http, https 모두 열어서 python은 http로 tcp통신.
//  클라이언트와는 https로 통신. (openssl로는 해결 할 수 없음. ca가 필요함)
router.post("/", (req, res) => {
  upload(req, res, (err) => {
    let buffers = req.file.buffer.toString("base64");

    //console.log(buffers);

    var zerorpc = require("zerorpc");
    var client = new zerorpc.Client({
      timeout: 600,
      heartbeatInterval: 120000,
    });

    // api로 바꾸기 위해서는 파이썬 서버 코드를 수정해야함.
    client.connect("tcp://192.168.0.100:4242"); // 해당 주소를 파이썬 서버로 직접연결

    console.log("start invoke");
    client.invoke(
      // 현재 버퍼에 올라가 있는 데이터와 파일의 오리지널 네임을 전송.
      // 오류가 없다면 반환값을 버퍼에 base64형태로 입력후 반환.
      // flutter 웹에서 데이터 읽어오지 못하는 부분 ‘key error 발생’
      // 클라이언트에서 req에서 해당 파일의 original name을 찾을 수 없던 문제 해결.
      "getMasteredAudio",
      req.file.buffer, // multer로 가져온 파일을 버퍼에 올린 상태. 해당 버퍼에 바이트 형태로 보내진 음원 데이터가 있음.
      req.file.originalname,
      function (error, resFromPython, more) {
        if (error != null) {
          console.log(error);
          res.status(500).send();
          res.end();
          return;
        }
        //console.log(resFromPython);
        //버퍼에 해당 정보를 base64형태로 변환해서 입력.
        res.write(new Buffer(resFromPython).toString("base64"));
        res.end();
        console.log("finished");
      }
    );
  });
});

module.exports = router;

/*  클라이언트 req 방식 변경으로 /web 비활성화.
// 플러터 웹에서 form data로 보내지 못할 시 해결하기 위한 api (app.js에서 body-Parser를 적용하여야함)
router.post("/web", (req, res) => {
  let buffer = req.data.bytes;
  let originalname = req.data.originalname;
  var zerorpc = require("zerorpc");
  var client = new zerorpc.Client({
    timeout: 600,
    heartbeatInterval: 120000,
  });
  // api로 바꾸기 위해서는 파이썬 서버 코드를 수정해야함.
  client.connect("tcp://192.168.0.100:4242"); // 해당 주소를 파이썬 서버로 직접연결

  console.log("start invoke");
  client.invoke(
    // 현재 버퍼에 올라가 있는 데이터와 파일의 오리지널 네임을 전송.
    // 오류가 없다면 반환값을 버퍼에 base64형태로 입력후 반환.
    "getMasteredAudio",
    buffer,
    originalname,
    function (error, resFromPython, more) {
      if (error != null) {
        console.log(error);
        res.status(500).send();
        res.end();
        return;
      }
      console.log(resFromPython);
      res.write(new Buffer(resFromPython).toString("base64"));
      res.end();
      console.log("finished");
    }
  );
});
*/
