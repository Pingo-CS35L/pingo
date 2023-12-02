// SERVER CONFIGURATION
const localIPAddress = "172.23.103.54";//"YOUR_IP_ADDRESS from localip shell script";
const portNum = 8080;

const backendServer = `http://${localIPAddress}:${portNum}`

export { localIPAddress, portNum, backendServer };
