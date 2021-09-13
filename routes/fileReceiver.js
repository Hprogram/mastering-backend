var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require("fs");


router.get('/', function (req, res, next) {
  res.send("test")
});

const upload = multer({
  storage: multer.memoryStorage()
}).single('file');

router.post('/', (req, res) => {
  upload(req, res, err => {
    //console.log(req);
    //if (err) console.log(err);
    
    //console.log(req.file);
    //console.log("file load completed!! need to convert audio file");
    
    //Need to Convert Audio file in below
    //req.file.filename="fixedFile.wav";
  
    //res.writeHead(200, {"Content-Type":"audio/wav"});
    
    var zerorpc = require("zerorpc");
    var client = new zerorpc.Client({ timeout: 600, heartbeatInterval: 120000 });
    client.connect("tcp://127.0.0.1:4242");
    console.log("start invoke")
    client.invoke("getMasteredAudio", req.file.buffer, req.file.originalname, function(error, resFromPython, more) {
      if (error != null) {
        console.log(error)
        res.status(500).send()
        res.end();
        return ;
      }
      console.log(resFromPython)
      res.write(new Buffer(resFromPython).toString("base64"))
      res.end()
      console.log("finished")
    });
    // var fs = require('fs');
    // fs.readFile('./routes/sample_test_eq.wav', function(err,data){
    //   console.log()
    //   res.write(new Buffer(data).toString("base64"));
    //   res.end();
    //   console.log("send response!");
    // });
  });
})

module.exports = router;
