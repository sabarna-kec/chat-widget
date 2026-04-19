#!/bin/bash

# K3s Setup Script for Jenkins Server
# Run this on your Jenkins server (13.232.3.204)

set -e

echo "🚀 Starting K3s installation..."

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install K3s
echo "📦 Installing K3s..."
curl -sfL https://get.k3s.io | sh -

# Wait for K3s to start
echo "⏳ Waiting for K3s to start..."
sleep 10

# Verify K3s is running
echo "✅ Checking K3s status..."
sudo k3s kubectl get nodes

# Create namespace
echo "📂 Creating chat-widget namespace..."
sudo k3s kubectl create namespace chat-widget || echo "Namespace already exists"

# Setup kubeconfig for jenkins user
echo "🔐 Setting up kubeconfig for jenkins user..."
sudo mkdir -p /home/jenkins/.kube
sudo cp /etc/rancher/k3s/k3s.yaml /home/jenkins/.kube/config
sudo sed -i "s/127.0.0.1/13.232.3.204/g" /home/jenkins/.kube/config
sudo chown jenkins:jenkins /home/jenkins/.kube/config
sudo chmod 600 /home/jenkins/.kube/config

# Enable K3s to start on boot
echo "🔄 Enabling K3s on boot..."
sudo systemctl enable k3s

# Create ConfigMap
echo "⚙️ Creating ConfigMap..."
sudo k3s kubectl apply -f /root/chat-widget/k3s/configmap.yaml

# Build and load Docker images into K3s
echo "🐳 Building Docker images..."
cd /root/chat-widget/backend
sudo docker build -t chat-widget-backend:latest .

cd /root/chat-widget/frontend
sudo docker build -t chat-widget-frontend:latest .

echo "✅ K3s setup complete!"
echo ""
echo "Next steps:"
echo "1. Deploy backend: sudo k3s kubectl apply -f /root/chat-widget/k3s/backend-deployment.yaml -n chat-widget"
echo "2. Deploy frontend: sudo k3s kubectl apply -f /root/chat-widget/k3s/frontend-deployment.yaml -n chat-widget"
echo "3. Deploy ingress: sudo k3s kubectl apply -f /root/chat-widget/k3s/ingress.yaml -n chat-widget"
echo ""
echo "Access your app at: http://13.232.3.204/"
