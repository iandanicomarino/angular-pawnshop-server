var express= require ('express');
var cors =  require ('cors')
var bodyparser= require ('body-parser');
var Nexmo = require('nexmo');

var router = express.Router();
var app = express();
var port = process.env.PORT || 1111;

var helper = require('sendgrid').mail;
var sg = require('sendgrid')(sendgridkey);

console.log(process.env.SENDGRID_API_KEY)

var nexmo = new Nexmo({
    apiKey: '52fcf0c4',
    apiSecret: 'e99cb675c805c253',
  });


app.use(cors());
app.use(bodyparser.json());


app.get('/sendSMS', function(req, res) {
    console.log(req.query)
    var message = "Good day MR./MRS. "+ req.query.name + ". Your item, " +req.query.item+ " in pawnshop LA MARINO is about to be expired within 2 days upon receiving this SMS. Please settle your loan as soon as possible."
    nexmo.message.sendSms('PAWNSHOPPE', req.query.cellphone , message ,function(success){
        res.status(200).send('cool')
    });
});


app.get('/sendEmail', function(req, res) {
    console.log('iminside')
    console.log(req.query)
    var fromEmail = new helper.Email('pawnshop@iandanico.com');
    var toEmail = new helper.Email(req.query.email);
    var subject = 'Your item is about to be expired';
    var content = new helper.Content('text/html', 
                                    "<h3>Good day MR./MRS "+ req.query.name + "</h3><br>"+
                                    "Your item, " +req.query.item+ 
                                    " in PAWNSHOPPE LA MARINO is about to be expired within 2 days upon recieving this email" +
                                    " Please settle your loan as soon as possible.<br> Thank you! <br> MANAGEMENT");
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);

    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });
    sg.API(request, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        res.status(200).send('sent email')
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
        });
});



app.listen(port);
console.log("server started: port 1111");