export async function getLocalIP() {
    try {
        const response = await fetch("https://checkip.amazonaws.com/");
        const ipAddress = await response.text();
        return ipAddress.trim();
    } catch (error) {
        console.error("Error fetching IP address:", error);
        return null;
    }
}
