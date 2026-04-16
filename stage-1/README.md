# Stage 1 — Build & Deploy a Personal API
This project demonstrates how to deploy a simple Node.js API using Express, 
reverse proxied with Nginx, and secured with SSL.
 
---
## What I Did
### 1. Installed Node.js 20 using NodeSource
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Built the API and Created the systemd Service
```bash
mkdir ~/stage1-api && cd ~/stage1-api
npm init -y
npm install express
nano index.js
```
Created [index.js](https://github.com/tuucay4/HNG14-Devops/blob/main/stage-1/index.js)

Created [stage1-api.service](https://github.com/tuucay4/HNG14-Devops/blob/main/stage-1/stage1-api.service)

```bash
sudo systemctl daemon-reload
sudo systemctl enable stage1-api
sudo systemctl start stage1-api
```

### 3. Tested the API Locally
```bash
node index.js
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/me
```
| Endpoint | Response |
|--------|----------|
| `/` | `{"message": "API is running"}` |
| `/health` | `{"message": "healthy"}` |
| `/me` | `{"name": "Abdulhamid Bello", "email": "abdulhamidbelloabefe@gmail.com", "github": "https://github.com/tuucay4"}` |

### 4. Configured Nginx Reverse Proxy
Merged the config into my existing Stage 0 Nginx config (same domain, same SSL cert):
```bash
sudo nano /etc/nginx/sites-available/project-cloudlabs
```
Edited the SSL server block:
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```
```bash
sudo systemctl daemon-reload
sudo systemctl reload nginx
```
The Port 3000 is never exposed publicly. This way Nginx takes all traffic on 443 and forwards it internally to the app.

## Key Concepts Learned

**Reverse Proxy**
Nginx sits between the internet and your app. The public never touches port 3000 directly. Nginx receives the request and forwards it internally.

**systemd for Node**
`Restart=always` + `enable` = your app survives crashes and reboots without you touching anything. This is what "persistently running" means in production.

---