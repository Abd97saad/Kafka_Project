var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

//For Kafka 
var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var Client = kafka.KafkaClient;
var argv = require('optimist').argv;
var value;
var topic;
var json;

//body-parser
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


//Creating kafka client
var client = new Client({ kafaHost: 'localhost:9092' });

//Creating Kafka Consumer
var topics = [{ topic: "temperature"},{ topic: "sound"},{ topic: "gas"},{ topic: "humidity"}];
var options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };
var consumer = new Consumer(client, topics, options);
var offset = new Offset(client);

let data = {};

//Consuming the messages
consumer.on('message', function (message) {
  data=message;
  //console.log(typeof data[0]);
  //JSON.parse(data[0]);
  // console.log(data);
  // console.log("2222222222222222222222")
  // if(message.topic == 'temperature'){
  //   data[0]=message;
  // }
  // else if(message.topic == 'sound'){
  //   data[1]=message;
  // }
  //console.log(message.topic);
  //console.log(data);
});

//sending the message
router.get('/api', function(req, res) {
  //console.log(data);
  // // topic = data[0].topic;
  //console.log("------")
  // // value = data[0].value;
  // // console.log(data[0].topic);
  // // console.log(data[0].value);
  console.log(data["topic"] + " Sent");
  // json = {"topic":topic, "values":value};
  return res.send(JSON.stringify(data));

});

router.post('/api2', function(req, res){
  if(req.body['status'] == "off"){
    var topic = req.body['topic'];
    console.log("pause " + topic)
    consumer.pauseTopics([topic]);
    console.log("pause " + topic)
  }
  else{
    var topic = req.body['topic'];
    console.log("resume " + topic)
    consumer.resumeTopics([topic]);
    console.log("resume " + topic)
  }
});

consumer.on('error', function (err) {
  console.log('error', err);
});

// consumer.resumeTopics("gas_topic");
// consumer.pauseTopics("gas_topic");

function offs(err, offsets) {
  if (err) {
    return console.error(err);
  }
  var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
  consumer.setOffset(topic.topic, topic.partition, min);
}
function top(topic) {
topic.maxNum = 2;
offset.fetch([topic], offs);
}
consumer.on('offsetOutOfRange', top);
/*
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  json_obj = JSON.parse(msg);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(5000,"");
// server listening 0.0.0.0:41234
*/
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {data:json});
});


module.exports = router;
