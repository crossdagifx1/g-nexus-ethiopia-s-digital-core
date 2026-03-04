import * as ftp from 'basic-ftp';
import * as path from 'path';

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "ftp.gnexuset.com",
            user: "gnexus@gnexuset.com",
            password: "GV~7Lumwu@NlYwS!",
            secure: false
        });
        console.log("Connected to FTP server");

        // Upload the contents of dist to the FTP root directly
        await client.uploadFromDir("dist", ".");

        console.log("Deployment successful!");
    } catch (err) {
        console.error("Deployment failed:", err);
        process.exit(1);
    } finally {
        client.close();
    }
}

deploy();
