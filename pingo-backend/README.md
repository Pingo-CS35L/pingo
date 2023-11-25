# Backend

## IMPORTANT Pre-Requisites
1. Ensure your mobile device and server are connected to the same LAN.

## Server Setup
1. Run the Shell Script `localip_mac` to quickly access your local network IP address for Mac OS Users
    - Alternatively, Windows users can utilize the power shell with ipconfig to derive their local network IP address

2. Once the local network IP Address is obtained, go to the `serverConfig.js` file to update your server's local IP address
    - If you would like Node.js to automatically assign an available port for your server to listen on, please set `portNum = 0`.

3. You can now update this server location into your `serverConfig.js` file in the project directory to allow communication between the frontend and backend.