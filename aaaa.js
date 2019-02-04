var express = require('express'); 
const randomstring = require("randomstring"); 
var QRCode = require('qrcode'); 
var mysql = require('mysql'); 
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
//var bodyParser = require('body-parser'); 

var app = express(); 
app.use(bodyParser.json({ limit: '50mb' }));
var  body_to_send_one = null;
var body_to_send = null; 
var request_body=null; 
//var parser = bodyParser.json() 
var qr_code_stringified = null; 
//var time = new Date(); 
//var time_plus_one = time.getFullYear() + 1; 
//var JSON_mobile_auth =  { externalUserId: null , qrCode: null , keyExpirationTime: null}; 

var connection = mysql.createConnection({ 
host : 'localhost', 
user : 'root', 
password : '', 
database : 'json_body', 
insecureAuth : 'true' 
}); 
//
function set_value_one_array(url, param, number_queue){ 
return new Promise((resolve, reject) => { 

connection.query('SELECT ResBody FROM httpresponse WHERE url LIKE ? AND changebool = 1 AND param = ? AND numberqueue = ? ORDER BY id ' ,['%' + url + '%', param, number_queue ] , function (error, results, fields) { 

 var body_to_send_one = results[0].ResBody; 
//return body_to_send_one;
resolve(body_to_send_one); 
if(error)
	reject('nay');
}); 

});

}
//
function get_value_length(url, param){ 


return new Promise((resolve, reject) => { 

connection.query('SELECT ResBody FROM httpresponse WHERE url LIKE ? AND changebool = 1 AND param = ? ORDER BY id ' ,['%' + url + '%', param] , function (error, results, fields) { 

 var body_to_send_one = results.length; 
//return body_to_send_one;
resolve(body_to_send_one); 
if(error)
	reject('nay');
}); 

});

}

function set_value (url){ 
return new Promise((resolve, reject) => { 

connection.query('SELECT ResBody FROM httpresponse WHERE url LIKE ? ORDER BY id' ,['%' + url + '%'] , function (error, results, fields) { 
body_to_send = results; 
resolve('yay!'); 
if(error)
	reject('nay');
}); 

}); 



} 

function set_value_one(url, param){ 
return new Promise((resolve, reject) => { 

connection.query('SELECT ResBody FROM httpresponse WHERE url LIKE ? AND changebool = 1 AND param = ? ORDER BY id ' ,['%' + url + '%', param] , function (error, results, fields) { 

 var body_to_send_one = results[0].ResBody; 
//return body_to_send_one;
resolve(body_to_send_one); 
if(error)
	reject('nay');
}); 

});



}

app.post(/(ums\/rest\/api\/certificates\/.*\/status)/ ,  function (req,res,next){
	res.status(200);  
	res.append('Content-Type', 'application/json'); 
	res.append('Date', Date().toString().substring(0,28));
	next();
},async function (req,res,next){
	var add_to_array = {
    CertificateBase64: 'MII…',
    DName: 'CN=bob',
    ID: 2,
    IsDefault: false,
    CertificateAuthorityID: 1,
    CspID: null,
    HashAlgorithms: null,
    ProviderName: 'ABC',
    ProviderType: 0,
    CertificateType: "1",
    Status: {
      Value: 1,
      RevocationInfo: null,
      PinCode: null,
      ActiveCertId: 0
    }
  }	
    
	
res.send(JSON.stringify(add_to_array)) 
 
	
	
res.end(); 
}
)


app.get(/(STS\/ums\/user\/.*\/operationpolicy)/ ,  async function(req, res , next){
res.status(200);	


next();
},function (req,res, next){
	res.append('Date', Date().toString().substring(0,28)); 
	res.append('Content-Type', 'application/json'); 
	next();
},function (req,res, next){
var JSON_body = [
  {
    Action: 1,
    ConfirmationRequired: false
  },
  {
    Action: 2,
    ConfirmationRequired: true
  },
  {
    Action: 4,
    ConfirmationRequired: false
  },
  {
    Action: 8,
    ConfirmationRequired: false
  },
  {
    Action: 16,
    ConfirmationRequired: false
  },
  {
    Action: 32,
    ConfirmationRequired: false
  },
  {
    Action: 64,
    ConfirmationRequired: false
  },
  {
    Action: 128,
    ConfirmationRequired: false
  },
  {
    Action: 256,
    ConfirmationRequired: false
  },
  {
    Action: 512,
    ConfirmationRequired: false
  },
  {
    Action: 1024,
    ConfirmationRequired: true
  }
]
 res.send(JSON.stringify(JSON_body)); 
	res.end();
});
//Создать нового пользователя
app.post('/STS/ums/user',  async function (req, res, next) { 
res.status(200); 
await set_value('/STS/ums/user'); 
next(); 

}, function (req, res, next) { 

res.append('Date', Date().toString().substring(0,28)); 
res.append('Content-Type', 'application/json'); 
next(); 

}, function (req, res , next ) { 
if (body_to_send[0].ResBody != "" && body_to_send[0].ResBody != null ){ 
res.send(body_to_send[0].ResBody); 
} 
else{ 
res.send(randomstring.generate(8)); 
} 
res.end();

}); 
//Получить список пользователей
app.post('/STS/ums/users',  async function (req, res, next) { 
res.status(200);  
res.append('Cache-Control', 'no-cache'); 
res.append('Pragma', 'no-cache');
res.append('Content-Type', 'application/json'); 
res.append('Expires', '-1'); 
res.append('Date', Date().toString().substring(0,28));
next(); 

}, async function (req,res, next){
	var time = new Date();
	var settled_length = await get_value_length('/STS/ums/users', 'login')
	var JSON_body = {UserInfos:[],
							TotalCount:settled_length,
							AffectedCount:settled_length
	};
		
	
	async function create_array(){
 //return new Promise((resolve, reject) => { 
//if (error) throw error;
   for (var i = 0;i < settled_length; i++){
	   var add_to_array = { UserId:randomstring.generate(8) , 
	                                    Login:randomstring.generate(8), 
										PhoneNumber: null,
										Email:null,
										PhoneConfirmed:false,
										EmailConfirmed:false, 
										DisplayName:null,
										DistinguishName:null,
										AccountLocked:false,
										Group:"Default",
										CreationDate:time.toISOString(),
										LockoutDate:null,
										LastLoginDate:time.toISOString()}
	   var UserId = await set_value_one_array('/STS/ums/users', 'UserId' , i+1); 
	   var Login = await set_value_one_array('/STS/ums/users', 'Login' , i+1);
	   var PhoneNumber = await set_value_one_array('/STS/ums/users', 'PhoneNumber' , i+1);
	   var Email = await set_value_one_array('/STS/ums/users', 'Email' , i+1);
	   
	   if (UserId != "" && UserId != null) 
          add_to_array.UserId = UserId ;
	  if (Login != "" && Login != null) 
          add_to_array.Login = Login ;
	  if (PhoneNumber != "" && PhoneNumber != null) 
          add_to_array.PhoneNumber = PhoneNumber ;
	  if (Email != "" && Email != null) 
          add_to_array.Email = Email ;
	  
	   JSON_body.UserInfos.push(add_to_array);
   }
	   return new Promise((resolve,reject) => {
	   resolve("result");
	   })
	   
   };

//resolve("result");

//})

await create_array()
	res.send(JSON.stringify(JSON_body)); 
	res.end

});
//////////////////////
//Назначение мобильного аутентификатора
    app.post(/(STS\/ums\/user\/.*\/mobileauth$)/,   async function (req, res, next) { 
res.status(200);  
res.append('Content-Type', 'application/json'); 
res.append('Date', Date().toString().substring(0,28)); 
res.append('Expires', '-1'); 
next(); 

 

},async function (req, res , next ) { 
	var externalUserId = await set_value_one('/mobileauth', 'externaluserid');	
	var qrCode = await set_value_one('/mobileauth', 'qrCode');
	var keyExpirationTime = await set_value_one('/mobileauth', 'keyExpirationTime');
	var time = new Date(); 
	var time_plus_one = time.getFullYear() + 1; 
	var JSON_mobile_auth = { externalUserId: randomstring.generate(8) , qrCode: qr_code_stringified , keyExpirationTime: time.toISOString() } 
 
	function set_value(){
 return new Promise((resolve, reject) => { 
//if (error) throw error;

if (externalUserId != "" && externalUserId != null) 
JSON_mobile_auth.externalUserId = externalUserId; 

if (qrCode != "" && qrCode != null) 
JSON_mobile_auth.qrCode = qrCode; 

if (keyExpirationTime != "" && keyExpirationTime != null) 
JSON_mobile_auth.keyExpirationTime = keyExpirationTime ; 

resolve("result");

})
}
 await set_value();
  res.send(JSON.stringify(JSON_mobile_auth)) 
 
	
	
res.end(); 
});  
//сервер возвращает идентификатор транзакции на Сервисе Подписи
    app.post('/STS/confirmation' , function(req, res , next){
    res.status(200);	
    res.append('Content-Type', 'application/json'); 
	res.append('Date', Date().toString().substring(0,28)); 
    next();
}, async function (req,res,next){
	var image_value = await set_value_one('/STS/confirmation', 'value');
	var refID = await set_value_one('/STS/confirmation', 'refid');
	var timeout = await set_value_one('/STS/confirmation', 'timeout');
	var timeout_to_number = Number(timeout);
		
	//var contextdata_refid = await set_value_one('/STS/confirmation', 'contextdata.refid');
	var JSON_confirmation = { 
	    Challenge: {
			Title:{Value: 'Подвердите операцию на устройстве с помощью приложения'},
		    TextChallenge: [
								{
									Image:{
										MimeType:'image/gif',
										Value: qr_code_stringified
									},
									AuthnMethod:'http://dss.cryptopro.ru/identity/authenticationmethod/mobile',
									RefID: refID ,
									MaxLenSpecified: false , 
									HideTextSpecified:false
									
								}
							],
			ContextData:{RefID:refID}	
									
									},
		IsFinal:false,
		IsError:false
		
	}
		  function set_value(){
 return new Promise((resolve, reject) => { 
		  
		if (image_value != "" && image_value != null) 
		    JSON_confirmation.Challenge.TextChallenge[0].Image.Value = image_value;
	
		if (refID != "" && refID != null) {
		    JSON_confirmation.Challenge.TextChallenge[0].RefID = refID;
		    JSON_confirmation.Challenge.ContextData.RefID = refID;
		}
		else {
			JSON_confirmation.Challenge.TextChallenge[0].RefID = JSON_confirmation.Challenge.ContextData.RefID = refID = randomstring.generate(8);
		}
			
		
		
		 resolve("result");
 })
         
		  }
		  
		  function send_request(RefID,timeout){
			setTimeout(() => {
    var myJSONObject = { Result:"success" , TransactionId:RefID, Error:""};
    request({
        url: "http://localhost:8900/dssManager/services/fromdss",
        method: "POST",
        json: true,   // <--Very important!!!
        body: myJSONObject
}, function (error, response, body){
    console.log(response.statusCode);
});
},timeout);
   return new Promise((resolve,reject) => {
	   	   resolve("result");
	   
   });
} 
		  
		  
		await set_value();
		 
        res.send(JSON.stringify(JSON_confirmation));
		
		if(timeout_to_number > 0)
		await send_request(refID,timeout_to_number);
		
		res.end();
	}); 
	//информация о пользователе
	app.get(/(\/STS\/ums\/user(.*)$)/ , async function(req, res , next){
 res.status(200);	
 res.append('Content-Type', 'application/json'); 
 res.append('Date', Date().toString().substring(0,28)); 

next();
},  async function (req,res, next){
	var userId = await set_value_one('/STS/ums/user/get', 'userid');
	var login = await set_value_one('/STS/ums/user/get', 'login');
	var phoneNumber = await set_value_one('/STS/ums/user/get', 'phonenumber');
	var email = await set_value_one('/STS/ums/user/get', 'email');
	var time = new Date();
	var JSON_body = { UserId:randomstring.generate(8) , 
	                                    Login:randomstring.generate(8), 
										PhoneNumber: null,
										Email:null,
										PhoneConfirmed:false,
										EmailConfirmed:false, 
										DisplayName:null,
										DistinguishName:null,
										AccountLocked:false,
										Group:"Default",
										CreationDate:time.toISOString(),
										LockoutDate:null,
										LastLoginDate:time.toISOString()
                                    };
									
			function set_value(){
 return new Promise((resolve, reject) => { 
			if (userId != "" && userId != null) 
				JSON_body.UserId = userId;
				
			if (login != "" && login != null) 
				JSON_body.Login = login;
				
			if (phoneNumber != "" && phoneNumber!= null) 
				JSON_body.PhoneNumber = phoneNumber;
			
			if (email != "" && email != null) 
				JSON_body.Email = email;
			resolve("result");
 })
			}
		
		await set_value();

            res.send(JSON.stringify(JSON_body)); 

		
    
	res.end();
}); 


    app.get('/STS/oauth/authorize/certificate' ,  async function(req, res , next){
res.status(302);	


next();
},function (req,res, next){
	res.append('Date', Date().toString().substring(0,28)); 
	res.append('Location' , 'urn:ietf:wg:oauth:2.0:oob:auto?code=7d921a45fab293ed1185863f3a662c88');
	res.send('')
	res.end();
});

    

    app.post('/STS/oauth/token', function(req,res,next){
	res.status(200);
	res.append('Date', Date().toString().substring(0,28)); 
	res.append('Content-Type', 'application/json'); 
	next();
}, async function (req,res,next){
	var access_token = await set_value_one ('/STS/oauth/token' , 'access_token');
	var expires_in = await set_value_one ('/STS/oauth/token' , 'expires_in');
	var JSON_body = {access_token: randomstring.generate(20), expires_in:300}
	
    function set_value(){
 return new Promise((resolve, reject) => { 
//if (error) throw error;

if (access_token != "" && access_token != null) 
JSON_body.access_token = access_token; 

if (expires_in != "" && expires_in != null) 
JSON_body.expires_in = Number(expires_in); 

resolve("result");

})
}
 await set_value();
  res.send(JSON.stringify(JSON_body)) 
}
);

    app.get('/ums/rest/api/certificates', function(req,res,next){
	res.append('Date', Date().toString().substring(0,28)); 
	res.append('Content-Type', 'application/json');
	next();
}, async function (req,res,next){
	var JSON_body = [ ];
	var settled_length = await get_value_length('/rest/api/certificates', 'CertificateBase64')
	
	async function create_array(){
		for (var i = 0;i < settled_length; i++){
	var add_to_array = {
    CertificateBase64: 'MII…',
    DName: 'CN=bob',
    ID: 2,
    IsDefault: false,
    CertificateAuthorityID: 1,
    CspID: null,
    HashAlgorithms: null,
    ProviderName: 'ABC',
    ProviderType: 0,
    CertificateType: "1",
    Status: {
      Value: 1,
      RevocationInfo: null,
      PinCode: null,
      ActiveCertId: 0
    }
  }	
    
	var CertificateBase64 = await set_value_one_array('/rest/api/certificates', 'CertificateBase64' , i+1);
	var DName = await set_value_one_array('/rest/api/certificates', 'DName' , i+1);
	var ID = await set_value_one_array('/rest/api/certificates', 'ID' , i+1);
	var CspID = await set_value_one_array('/rest/api/certificates', 'CspID' , i+1);
	var HashAlgorithms = await set_value_one_array('/rest/api/certificates', 'HashAlgorithms' , i+1);
	var ProviderType = await set_value_one_array('/rest/api/certificates', 'ProviderType' , i+1);
	var Value = await set_value_one_array('/rest/api/certificates', 'Value' , i+1);
	var RevocationInfo = await set_value_one_array('/rest/api/certificates', 'RevocationInfo' , i+1);
	var PinCode = await set_value_one_array('/rest/api/certificates', 'PinCode' , i+1);
	var ActiveCertId = await set_value_one_array('/rest/api/certificates', 'ActiveCertId' , i+1);
	var CertificateType = await set_value_one_array('/rest/api/certificates', 'CertificateType' , i+1);
	var CertificateAuthorityID = await set_value_one_array('/rest/api/certificates', 'CertificateAuthorityID' , i+1);
	
	
	if (CertificateBase64 != "" && CertificateBase64 != null) 
          add_to_array.CertificateBase64 = CertificateBase64 ;
	  if (DName != "" && DName != null) 
          add_to_array.DName = DName ;
	  if (ID != "" && ID != null) 
          add_to_array.ID = Number(ID) ;
	  if (CspID != "" && CspID != null) 
          add_to_array.CspID = CspID ;
	  if (HashAlgorithms != "" && HashAlgorithms != null) 
          add_to_array.HashAlgorithms = HashAlgorithms ;
	  if (ProviderType != "" && ProviderType != null) 
          add_to_array.ProviderType = Number(ProviderType) ;
	  if (Value != "" && Value != null) 
          add_to_array.Status.Value = Number(Value) ;
	  if (RevocationInfo != "" && RevocationInfo != null) 
          add_to_array.Status.RevocationInfo = RevocationInfo ;
	  if (PinCode != "" && PinCode != null) 
          add_to_array.Status.PinCode = PinCode ;
	  if (ActiveCertId != "" && ActiveCertId != null) 
          add_to_array.Status.ActiveCertId = Number(ActiveCertId) ;
	  if (CertificateType != "" && CertificateType != null) 
          add_to_array.CertificateType = CertificateType ;
	  if (CertificateAuthorityID != "" && CertificateAuthorityID != null) 
          add_to_array.CertificateAuthorityID = Number(CertificateAuthorityID) ;
	
	    JSON_body.push(add_to_array);
		}
		return new Promise((resolve,reject) => {
	   resolve("result");
	   })
	}
	
await create_array()
	res.send(JSON.stringify(JSON_body)); 
	res.end
}
);
            			
										
    app.get('/STS/ums/policy' ,   function(req, res , next){
		
res.append('Date', Date().toString().substring(0,28)); 
res.append('Content-Type', 'application/json'); 
res.status(200);	
next();
},function (req,res, next){
	var JSON_body ={
  AvaliableIdentifierTypes: [0,2,1 ],
  AuthenticationPolicy: {
    Mode: 0,
    EditableByUser: false,
    AuthMethods: [
      {
        Identifier: 'http://schemas.microsoft.com/ws/2012/09/identity/authenticationmethod/none',
        Type: 1
      },
      {
        Identifier: 'http://dss.cryptopro.ru/identity/authenticationmethod/certificate',
        Type: 1
      },
      {
        Identifier: 'http://dss.cryptopro.ru/identity/authenticationmethod/password',
        Type: 1
      },
      {
        Identifier: 'http://dss.cryptopro.ru/identity/authenticationmethod/saml',
        Type: 1
      },
      {
        Identifier: 'http://dss.cryptopro.ru/identity/authenticationmethod/otpviasms',
        Type: 2
      },
      {
        Identifier: 'http://dss.cryptopro.ru/identity/authenticationmethod/oath',
        Type: 2
      },
      {
        Identifier: 'http://dss.cryptopro.ru/identity/authenticationmethod/simauth',
        Type: 2
      },
      {
        Identifier: 'http://dss.cryptopro.ru/identity/authenticationmethod/otpviaemail',
        Type: 2
      },
      {
        Identifier: 'http://dss.cryptopro.ru/identity/authenticationmethod/mobile',
        Type: 2
      },
      {
        Identifier: 'http://dss.cryptopro.ru/identity/authenticationmethod/mtmo',
        Type: 2
      }
    ],
    OperationPolicy: [
      {
        Action: 1,
        ConfirmationRequired: false
      },
      {
        Action: 2,
        ConfirmationRequired: false
      },
      {
        Action: 4,
        ConfirmationRequired: false
      },
      {
        Action: 8,
        ConfirmationRequired: false
      },
      {
        Action: 16,
        ConfirmationRequired: false
      },
      {
        Action: 32,
        ConfirmationRequired: false
      },
      {
        Action: 64,
        ConfirmationRequired: false
      },
      {
        Action: 128,
        ConfirmationRequired: false
      },
      {
        Action: 256,
        ConfirmationRequired: false
      },
      {
        Action: 512,
        ConfirmationRequired: false
      },
      {
        Action: 1024,
        ConfirmationRequired: false
      }
    ]
  },
  AllowUserRegistration: true,
  Groups: [
    {
      IdentityProviderName: 'realsts',
      GroupList: [
        'Default'
      ]
    }
  ],
  Rdns: [
    {
      Id: 1,
      Oid: '1.2.643.100.1',
      DisplayName: 'ОГРН',
      StringIdentifier: 'OGRN',
      Order: 16,
      MinLength: 13,
      MaxLength: 13,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 2,
      Oid: '1.2.643.100.5',
      DisplayName: 'ОГРНИП',
      StringIdentifier: 'OGRNIP',
      Order: 15,
      MinLength: 15,
      MaxLength: 15,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 3,
      Oid: '1.2.643.100.3',
      DisplayName: 'СНИЛС',
      StringIdentifier: 'SNILS',
      Order: 14,
      MinLength: 11,
      MaxLength: 11,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 4,
      Oid: '1.2.643.3.131.1.1',
      DisplayName: 'ИНН',
      StringIdentifier: 'INN',
      Order: 13,
      MinLength: 12,
      MaxLength: 12,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 5,
      Oid: '1.2.840.113549.1.9.1',
      DisplayName: 'Электронная почта',
      StringIdentifier: 'E',
      Order: 12,
      MinLength: 0,
      MaxLength: 128,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 6,
      Oid: '2.5.4.6',
      DisplayName: 'Страна',
      StringIdentifier: 'C',
      Order: 11,
      MinLength: 0,
      MaxLength: 2,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 7,
      Oid: '2.5.4.8',
      DisplayName: 'Область',
      StringIdentifier: 'S',
      Order: 10,
      MinLength: 0,
      MaxLength: 128,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 8,
      Oid: '2.5.4.7',
      DisplayName: 'Город',
      StringIdentifier: 'L',
      Order: 9,
      MinLength: 0,
      MaxLength: 128,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 9,
      Oid: '2.5.4.10',
      DisplayName: 'Организация',
      StringIdentifier: 'O',
      Order: 8,
      MinLength: 0,
      MaxLength: 64,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 10,
      Oid: '2.5.4.11',
      DisplayName: 'Подразделение',
      StringIdentifier: 'OU',
      Order: 7,
      MinLength: 0,
      MaxLength: 64,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 11,
      Oid: '2.5.4.3',
      DisplayName: 'Общее имя',
      StringIdentifier: 'CN',
      Order: 6,
      MinLength: 0,
      MaxLength: 128,
      Required: true,
      ValueSet:[]
    },
    {
      Id: 12,
      Oid: '2.5.4.9',
      DisplayName: 'Адрес',
      StringIdentifier: 'Street',
      Order: 5,
      MinLength: 0,
      MaxLength: 30,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 13,
      Oid: '2.5.4.12',
      DisplayName: 'Должность',
      StringIdentifier: 'T',
      Order: 4,
      MinLength: 0,
      MaxLength: 64,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 14,
      Oid: '2.5.4.43',
      DisplayName: 'Инициалы',
      StringIdentifier: 'I',
      Order: 3,
      MinLength: 0,
      MaxLength: 5,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 15,
      Oid: '2.5.4.42',
      DisplayName: 'Имя',
      StringIdentifier: 'G',
      Order: 2,
      MinLength: 0,
      MaxLength: 16,
      Required: false,
      ValueSet:[]
    },
    {
      Id: 16,
      Oid: '2.5.4.4',
      DisplayName: 'Фамилия',
      StringIdentifier: 'SN',
      Order: 1,
      MinLength: 0,
      MaxLength: 40,
      Required: false,
      ValueSet:[]
    }
  ],
  IdentityProviders: [
    {
      Description: null,
      IssuerName: 'realsts',
      DisplayName: null
    }
  ],
  CryptoProviders: [],
  MobileAuthSettings: {
    DeviceFingerprintRequired: false,
    KeyInfoDivideRequired: false
  }
}
	 res.send(JSON.stringify(JSON_body)); 
	res.end();
});	                                
			
	app.get('/ums/rest/api/requests' , function(req,res,next){
res.status(200);
res.append('Content-Type', 'application/json');
res.append('Date', Date().toString().substring(0,28)); 
next();
},async function (req,res,next){
	var settled_length = await get_value_length('/rest/api/requests', 'Base64Request')
    var JSON_body = [ ];
	
	async function create_array(){
		for (var i = 0;i < settled_length; i++){
	//Возможные значения параметра Status:"PENDING", "ACCEPTED", "REJECTED", "REGISTRATION"
	//Возможные значения параметра RequestType: "Certificate", "RevokeRequest".
	var add_to_array = {
	ID:1,
	Base64Request:'MII...',
	CertificateAuthorityID:1,
	CARequestID:"ABC",
	CADisplayName:"abc",
	DistName:"aaa",
	Subject:"bbb",
	CertificateID:1,
	Status:"PENDING",
	RequestType:"Certificate"
		
	}	
		var ID = await set_value_one_array('/rest/api/requests', 'ID' , i+1);
		var Base64Request = await set_value_one_array('/rest/api/requests', 'Base64Request' , i+1);
		var CertificateAuthorityID = await set_value_one_array('/rest/api/requests', 'CertificateAuthorityID' , i+1);
		var CARequestID = await set_value_one_array('/rest/api/requests', 'CARequestID' , i+1);
		var CADisplayName = await set_value_one_array('/rest/api/requests', 'CADisplayName' , i+1);
		var DistName = await set_value_one_array('/rest/api/requests', 'DistName' , i+1);
		var Subject = await set_value_one_array('/rest/api/requests', 'Subject' , i+1);
		var CertificateID = await set_value_one_array('/rest/api/requests', 'CertificateID' , i+1);
		var Status = await set_value_one_array('/rest/api/requests', 'Status' , i+1);
		var RequestType = await set_value_one_array('/rest/api/requests', 'RequestType' , i+1);
		
		if (ID != "" && ID != null) 
          add_to_array.ID = Number(ID) ;
	  if (Base64Request != "" && Base64Request != null) 
          add_to_array.Base64Request = Base64Request ;
	  if (CertificateAuthorityID != "" && CertificateAuthorityID != null) 
          add_to_array.CertificateAuthorityID = Number(CertificateAuthorityID) ;
	  if (CARequestID != "" && CARequestID != null) 
          add_to_array.CARequestID = CARequestID ;
	  if (CADisplayName != "" && CADisplayName != null) 
          add_to_array.CADisplayName = CADisplayName ;
	  if (DistName != "" && DistName != null) 
          add_to_array.DistName = DistName ;
	  if (Subject != "" && Subject != null) 
          add_to_array.Subject = Subject ;
	  if (CertificateID != "" && CertificateID != null) 
          add_to_array.CertificateID = Number(CertificateID) ;
	  if (Status == "PENDING" || Status == "ACCEPTED" || Status == "REJECTED" || Status == "REGISTRATION") 
          add_to_array.Status = Status ;
	  if (RequestType == "Certificate" && RequestType == "RevokeRequest") 
          add_to_array.RequestType = RequestType ;
	  
	  JSON_body.push(add_to_array);
		}
		return new Promise((resolve,reject) => {
	   resolve("result");
	   })
	}
	await create_array()
	res.send(JSON.stringify(JSON_body)); 
	res.end
	
	
	
});

app.post('/ums/rest/api/requests', function (req,res,next){
	res.status(200)
	res.append('Content-Type', 'application/json'); 
    res.append('Date', Date().toString().substring(0,28)); 
	next();
}, async function (req, res , next) {
	var JSON_body = {
	ID:1,
	Base64Request:'MII...',
	CertificateAuthorityID:1,
	CARequestID:"ABC",
	CADisplayName:"abc",
	DistName:"aaa",
	Subject:"bbb",
	CertificateID:1,
	Status:"PENDING",
	RequestType:"Certificate"
		
	}	
	//получение пути к запросу
	var Base64Request_path = await set_value_one('get64req', 'Path');
	//получение запроса в 64
	var Base64Request_data = await get_request_b64(Base64Request_path);
	
	var ID = await set_value_one('/api/requests/POST', 'ID');		
	var CertificateAuthorityID = await set_value_one('/api/requests/POST', 'CertificateAuthorityID');	
	var CARequestID = await set_value_one('/api/requests/POST', 'CARequestID');	
	var CADisplayName = await set_value_one('/api/requests/POST', 'CADisplayName');	
	var DistName = await set_value_one('/api/requests/POST', 'DistName');	
	var Subject = await set_value_one('/api/requests/POST', 'Subject');	
	var CertificateID = await set_value_one('/api/requests/POST', 'CertificateID');	
	var Status = await set_value_one('/api/requests/POST', 'Status');	
	var RequestType = await set_value_one('/api/requests/POST', 'RequestType');	
	
	function get_request_b64 (Base64Request_path){
	return new Promise((resolve,reject) => {
    fs.readFile(Base64Request_path, function(err, data) {
	var data_b64 = data.toString("base64");
	resolve(data_b64);
	   })
	});
	
}
	
	
	
	function set_value(){
 return new Promise((resolve, reject) => { 
//if (error) throw error;

if (Base64Request_data !="" && Base64Request_data != null)
	JSON_body.Base64Request = Base64Request_data
if (ID != "" && ID != null) 
JSON_body.ID = Number(ID); 
if (CertificateAuthorityID != "" && CertificateAuthorityID != null) 
JSON_body.CertificateAuthorityID = Number(CertificateAuthorityID); 
if (CARequestID != "" && CARequestID != null) 
JSON_body.CARequestID = CARequestID; 
if (CADisplayName != "" && CADisplayName != null) 
JSON_body.CADisplayName = CADisplayName; 
if (DistName != "" && DistName != null) 
JSON_body.DistName = DistName; 
if (Subject != "" && Subject != null) 
JSON_body.Subject = Subject; 
if (CertificateID != "" && CertificateID != null) 
JSON_body.CertificateID = Number(CertificateID); 
if (Status == "PENDING" || Status == "ACCEPTED" || Status == "REJECTED" || Status == "REGISTRATION") 
JSON_body.Status = Status; 
if (RequestType == "Certificate" && RequestType == "RevokeRequest") 
JSON_body.RequestType = RequestType; 




resolve("result");

})
}
 await set_value();
 res.send(JSON.stringify(JSON_body)) 
 
 res.end(); 
}
);

app.get("/ums/rest/api/policy", function (req,res,next){
	res.status(200);
	res.append('Date', Date().toString().substring(0,28)); 
	res.append('Content-Type', 'application/json'); 
	next();
}, function (req,res,next){
	var JSON_body = {CAPolicy:[{ID:1 , Name: "123" , Active:true , EKUTemplates:{} }] }
	 res.send(JSON.stringify(JSON_body)) 
	 res.end();
});

app.post('/ums/rest/api/certificates' ,  function (req,res,next){
	res.status(200);  
	res.append('Content-Type', 'application/json'); 
	res.append('Date', Date().toString().substring(0,28));
	next();
},async function (req,res,next){
	var add_to_array = {
    CertificateBase64: 'MII…',
    DName: 'CN=bob',
    ID: 2,
    IsDefault: false,
    CertificateAuthorityID: 1,
    CspID: null,
    HashAlgorithms: null,
    ProviderName: 'ABC',
    ProviderType: 0,
    CertificateType: "1",
    Status: {
      Value: 1,
      RevocationInfo: null,
      PinCode: null,
      ActiveCertId: 0
    }
  }	
    
	var CertificateBase64 = await set_value_one('/api/certificates/POST', 'CertificateBase64' );
	var DName = await set_value_one('/api/certificates/POST', 'DName' );
	var ID = await set_value_one('/api/certificates/POST', 'ID' );
	var CspID = await set_value_one('/api/certificates/POST', 'CspID' );
	var HashAlgorithms = await set_value_one('/api/certificates/POST', 'HashAlgorithms' );
	var ProviderType = await set_value_one('/api/certificates/POST', 'ProviderType' );
	var Value = await set_value_one('/api/certificates/POST', 'Value' );
	var RevocationInfo = await set_value_one('/api/certificates/POST', 'RevocationInfo' );
	var PinCode = await set_value_one('/api/certificates/POST', 'PinCode' );
	var ActiveCertId = await set_value_one('/api/certificates/POST', 'ActiveCertId' );
	var CertificateType = await set_value_one('/api/certificates/POST', 'CertificateType' );
	var CertificateAuthorityID = await set_value_one('/api/certificates/POST', 'CertificateAuthorityID' );
	
	function set_value(){
 return new Promise((resolve, reject) => { 
	if (CertificateBase64 != "" && CertificateBase64 != null) 
          add_to_array.CertificateBase64 = CertificateBase64 ;
	  if (DName != "" && DName != null) 
          add_to_array.DName = DName ;
	  if (ID != "" && ID != null) 
          add_to_array.ID = Number(ID) ;
	  if (CspID != "" && CspID != null) 
          add_to_array.CspID = CspID ;
	  if (HashAlgorithms != "" && HashAlgorithms != null) 
          add_to_array.HashAlgorithms = HashAlgorithms ;
	  if (ProviderType != "" && ProviderType != null) 
          add_to_array.ProviderType = Number(ProviderType) ;
	  if (Value != "" && Value != null) 
          add_to_array.Status.Value = Number(Value) ;
	  if (RevocationInfo != "" && RevocationInfo != null) 
          add_to_array.Status.RevocationInfo = RevocationInfo ;
	  if (PinCode != "" && PinCode != null) 
          add_to_array.Status.PinCode = PinCode ;
	  if (ActiveCertId != "" && ActiveCertId != null) 
          add_to_array.Status.ActiveCertId = Number(ActiveCertId) ;
	  if (CertificateType != "" && CertificateType != null) 
          add_to_array.CertificateType = CertificateType.toString() ;
	  if (CertificateAuthorityID != "" && CertificateAuthorityID != null) 
          add_to_array.CertificateAuthorityID = Number(CertificateAuthorityID) ;
	  
	  resolve("result");

})
}
await set_value();
  res.send(JSON.stringify(add_to_array)) 
 
	
	
res.end(); 
}
)

app.post(/(STS\/ums\/user\/.*\/authmethod\/idonly$)/ , function (req,res,next){
	res.status(200);
	res.append('Date', Date().toString().substring(0,28));
	res.send("");
	res.end();
});

app.post(/(STS\/ums\/user\/.*\/operationpolicy$)/ , function (req,res,next){
	res.status(200);
	res.append('Date', Date().toString().substring(0,28));
	res.send("");
	res.end();
});

app.post(/(STS\/ums\/user\/.*\/authmethod\/MobileAuth$)/ , function (req,res,next){
	res.status(200);
	res.append('Date', Date().toString().substring(0,28));
	res.send("");
	res.end();
});


app.post(/(STS\/ums\/user\/.*\/dn$)/ , function(req,res,next){
	res.status(200);
	res.append('Date', Date().toString().substring(0,28));
	res.send("");
	res.end();
});
 app.delete (/(\/ums\/rest\/api\/certificates(.*))/ , function (req,res){
	res.status(200);  	
	res.send("");
})
 
  app.delete (/(\/ums\/rest\/api\/requests(.*))/ , function (req,res){
	res.status(200);  	
	res.send("");
})

 app.delete(/(\/STS\/ums\/user(.*))/ , async function(req, res , next){
 res.status(200);	
 res.append('Date', Date().toString().substring(0,28)); 
 res.send("");
}); 
//код ниже запускается единожды при запуске сервера 
app.listen(3000, function (){ 
QRCode.toDataURL('I am a pony!', function (err, url) { 
qr_code_stringified = url.slice(22); 
}); 
connection.connect(); 

});