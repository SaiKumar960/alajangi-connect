const dns = require('dns');

dns.resolveSrv('_mongodb._tcp.cluster0.zkyh2yk.mongodb.net', (err, records) => {
  if (err) console.log('SRV failed:', err.code);
  else console.log('SRV:', JSON.stringify(records, null, 2));
});

dns.resolveTxt('cluster0.zkyh2yk.mongodb.net', (err, records) => {
  if (err) console.log('TXT failed:', err.code);
  else console.log('TXT:', JSON.stringify(records));
});
