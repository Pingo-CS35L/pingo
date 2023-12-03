// SERVER CONFIGURATION
const localIPAddress = "localhost"; // Use localhost by default; set this to your IP address for ethernet hosting
const portNum = 8080;

const backendServer = `http://${localIPAddress}:${portNum}`

export { localIPAddress, portNum, backendServer };
