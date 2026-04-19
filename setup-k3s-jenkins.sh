#!/bin/bash

# K3s Setup Script for Amazon Linux EC2 Instance
# Run this on your EC2 instance

set -e

echo "🚀 Starting K3s installation..."

# Update system
sudo yum update -y

# Install required packages
sudo yum install -y git  wget

# Install K3s
echo "📦 Installing K3s..."
curl -sfL https://get.k3s.io | sh -

# Wait for K3s to start
echo "⏳ Waiting for K3s to start..."
sleep 15

# Verify K3s is running
echo "✅ Checking K3s status..."
sudo k3s kubectl get nodes

# Create namespace
echo "📂 Creating chat-widget namespace..."
sudo k3s kubectl create namespace chat-widget || echo "Namespace already exists"

# Setup kubeconfig for jenkins user
echo "🔐 Setting up kubeconfig for jenkins user..."
sudo mkdir -p /var/lib/jenkins/.kube
sudo cp /etc/rancher/k3s/k3s.yaml /var/lib/jenkins/.kube/config

# Replace localhost with actual server IP
ACTUAL_IP=$(hostname -I | awk '{print $1}')
sudo sed -i "s/127.0.0.1/${ACTUAL_IP}/g" /var/lib/jenkins/.kube/config

sudo chown jenkins:jenkins /var/lib/jenkins/.kube/config
sudo chmod 600 /var/lib/jenkins/.kube/config

# Also setup for ec2-user
sudo mkdir -p /home/ec2-user/.kube
sudo cp /etc/rancher/k3s/k3s.yaml /home/ec2-user/.kube/config
sudo sed -i "s/127.0.0.1/${ACTUAL_IP}/g" /home/ec2-user/.kube/config
sudo chown ec2-user:ec2-user /home/ec2-user/.kube/config
sudo chmod 600 /home/ec2-user/.kube/config

# Enable K3s to start on boot
echo "🔄 Enabling K3s on boot..."
sudo systemctl enable k3s

# Create ConfigMap (update IP dynamically)
echo "⚙️ Creating ConfigMap..."
sudo sed -i "s/13.232.3.204/${ACTUAL_IP}/g" k3s/configmap.yaml
sudo k3s kubectl apply -f k3s/configmap.yaml -n chat-widget

echo "✅ K3s setup complete!"
echo ""
echo "🔥 Your EC2 IP: ${ACTUAL_IP}"
echo ""
echo "Next steps:"
echo "1. Deploy backend: sudo k3s kubectl apply -f k3s/backend-deployment.yaml -n chat-widget"
echo "2. Deploy frontend: sudo k3s kubectl apply -f k3s/frontend-deployment.yaml -n chat-widget"
echo "3. Deploy ingress: sudo k3s kubectl apply -f k3s/ingress.yaml -n chat-widget"
echo ""
echo "Access your app at: http://${ACTUAL_IP}/"
