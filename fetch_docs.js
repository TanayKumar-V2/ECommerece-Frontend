const https = require('https');

https.get('https://documenter.gw.postman.com/api/collections/26157218/2sB3QKqpma?segregateAuth=true&versionTag=latest', (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            
            parsedData.collection.item.forEach((folder) => {
               if(folder.item) {
                   folder.item.forEach(api => {
                       console.log(`- ${api.name}: ${api.request.method} ${api.request.url.raw}`);
                   });
               } else if (folder.request) {
                   console.log(`- ${folder.name}: ${folder.request.method} ${folder.request.url.raw}`);
               }
            });
            console.log("\nVariables:");
            parsedData.collection.variable.forEach(v => console.log(`${v.key}: ${v.value}`));
        } catch (e) {
            console.error(e.message);
        }
    });
}).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
