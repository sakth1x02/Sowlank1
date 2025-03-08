#!/bin/bash
# Install backend dependencies
echo "Installing backend dependencies..."
cd /var/www/backend
sudo pnpm install

# Set environment variables
echo "Setting environment variables..."

export PORT=1000
export MONGODB_URL=mongodb+srv://aakashRao:YADAVboy321$@cluster0.3igcn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
export CORS_ORIGIN=http://localhost:5173
export DATABASE_NAME=sowalnkdatabase
export CLOUDINARY_NAME=dazctict8
export CLOUDINARY_API_KEY=844179513943566
export CLOUDINARY_API_SECRET=7oXRDRU7P39WQcweC0tzhpvQrk8
export JWT_SECRET=sdjfwelkjcxvlk98iuKK
export RAZORPAY_KEY_ID=rzp_test_ENQwSlEzdyS4QG
export RAZORPAY_KEY_SECRET=LCdaB1ImcaeS8zWnmWKqFdL7
export MAILTRAP_TOKEN=c0ffc49f75d8cd7826336f3de4c3a290
export MAILTRAP_ENDPOINT=https://send.api.mailtrap.io/
export NODE_ENV=production

