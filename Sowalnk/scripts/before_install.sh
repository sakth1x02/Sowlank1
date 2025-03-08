#!/bin/bash

echo "Installing Nginx..."
sudo apt-get update
sudo apt-get install -y nginx


export VITE_RAZORPAY_KEY_ID=rzp_test_ENQwSlEzdyS4QG
export VITE_RAZORPAY_KEY_SECRET=LCdaB1ImcaeS8zWnmWKqFdL7


echo "Building the React app..."
cd /Sowalnk
pnpm install
pnpm run build