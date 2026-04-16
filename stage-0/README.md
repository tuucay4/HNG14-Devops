# Stage 0 — Linux Server Setup & Nginx Configuration
Provision, harden and serve: no Docker, no automation, just i and a bare Linux server.

---
## What I Did

### 1. Launched EC2 Instance
Provisioned a t2.micro Ubuntu 22.04 instance on AWS EC2. Security group set to allow ports 22, 80, and 443 from anywhere. Port 22 had to be open to all IPs because the grading bot SSHes in from an unknown IP.

### 2. Created the `hngdevops` User
```bash
sudo adduser hngdevops
sudo usermod -aG sudo hngdevops
```

### 3. Added Grader's SSH Public Key whit Permissions
```bash
sudo mkdir -p /home/hngdevops/.ssh
sudo nano /home/hngdevops/.ssh/authorized_keys
# then pasted grader's public key

sudo chmod 700 /home/hngdevops/.ssh
sudo chmod 600 /home/hngdevops/.ssh/authorized_keys
sudo chown -R hngdevops:hngdevops /home/hngdevops/.ssh
```


### 4. Hardened SSH Configuration
```bash
sudo nano /etc/ssh/sshd_config
```
Changed to:
```
PermitRootLogin no
PasswordAuthentication no
```
this ensures no passwords are allowed, key-based auth only. Root login completely disabled.
```bash
sudo systemctl restart ssh
```

### 5. Configured UFW Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

### 6. Installed and configured Nginx
```bash
sudo apt update && sudo apt install nginx -y
```
Created the HTML page:
```bash
sudo nano /var/www/html/index.html
```
```html
<!DOCTYPE html>
<html>
<head>
    <title>HNG DevOps</title>
</head>
<body>
    <h1>abdulhamid-bello</h1>
</body>
</html>
```

Created the site config:
```bash
sudo nano /etc/nginx/sites-available/project-cloudlabs
```
```nginx
server {
    listen 80;
    server_name project-cloudlabs.com www.project-cloudlabs.com;

    location / {
        root /var/www/html;
        index index.html;
    }

    location /api {
        default_type application/json;
        return 200 '{"message": "HNGI14 Stage 0", "track": "DevOps", "username": "abdulhamid-bello"}';
    }
}
```

Enabled the site and removed the default:
```bash
sudo ln -s /etc/nginx/sites-available/project-cloudlabs /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl reload nginx
```

### 7. Pointed Domain to EC2 in Route 53
Created two A records:
- `project-cloudlabs.com` → `ec2-ip`
- `www.project-cloudlabs.com` → `ec2-ip`

### 8. Got SSL Certificate with Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d project-cloudlabs.com -d www.project-cloudlabs.com
```
The certbot configured HTTPS on port 443, added the HTTP to HTTPS `301` redirect automatically to nginx.

---

