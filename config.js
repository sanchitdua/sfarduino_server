exports.PORT = process.env.PORT || 3001; // use heroku's dynamic port or 3001 if localhost
exports.DEBUG = true; 
exports.ENVIRONMENT = 'production';  
exports.CALLBACK_URL = 'http://localhost:3001'; // Port on which the application will listen by default
exports.PUSH_TOPIC = '/topic/AllAccounts'; // Streaming Push Topic Name

exports.CLIENT_ID = 'YOUR_CLIENT_ID';
exports.CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
exports.USERNAME = 'YOUR_SALESFORCE_USERNAME';
exports.PASSWORD = 'YOUR_SALESFORCE_PASSWORD'+'YOUR_SALESFORCE_SECURITY_TOKEN'; 