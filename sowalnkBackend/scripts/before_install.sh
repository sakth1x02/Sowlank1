#!/bin/bash
# Install Node.js and PM2
echo "Installing Node.js and PM2..."
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo pnpm install -g pm2

# Install MongoDB (if using locally)
echo "Installing MongoDB..."
sudo apt-get install -y mongodb