#!/bin/bash
# Start the Node.js server
echo "Starting the server..."
cd /var/www/backend
sudo pm2 start index.js --name "sowalnk-backend"