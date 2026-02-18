const https = require('https');
const body = JSON.stringify({username:'franciscodesenvolve', password:'Platao3914$Mouse'});
const req = https.request({
  hostname:'www.transpjardim.com',
  path:'/api/auth/login',
  method:'POST',
  headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}
},(res)=>{
  let d='';
  res.on('data',c=>d+=c);
  res.on('end',()=>{
    console.log('Status:', res.statusCode);
    console.log('Body:', d.slice(0,500));
  });
});
req.write(body);
req.end();
