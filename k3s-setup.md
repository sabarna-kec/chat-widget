# K3s Deployment Guide for Chat Widget

## Prerequisites

- Server with 2GB+ RAM (K3s requirement)
- Ubuntu/Debian Linux (or any Linux distribution)
- `curl` installed
- `kubectl` installed locally (for management)

## Step 1: Install K3s on Your Server

```bash
# SSH into your Jenkins server
ssh user@13.232.3.204

# Install K3s (single command)
curl -sfL https://get.k3s.io | sh -

# Verify installation
sudo k3s kubectl get nodes
```

## Step 2: Get K3s kubeconfig for Local Management

```bash
# On your server, get the kubeconfig
sudo cat /etc/rancher/k3s/k3s.yaml

# Copy the output and save locally as ~/.kube/config-k3s
# Then update the server IP from 127.0.0.1 to your actual IP (13.232.3.204)
```

## Step 3: Create Kubernetes Namespace

```bash
kubectl create namespace chat-widget
```

## Step 4: Create ConfigMap for Environment Variables

```bash
kubectl apply -f k3s/configmap.yaml -n chat-widget
```

## Step 5: Deploy Backend

```bash
kubectl apply -f k3s/backend-deployment.yaml -n chat-widget
kubectl apply -f k3s/backend-service.yaml -n chat-widget
```

## Step 6: Deploy Frontend

```bash
kubectl apply -f k3s/frontend-deployment.yaml -n chat-widget
kubectl apply -f k3s/frontend-service.yaml -n chat-widget
```

## Step 7: Deploy Ingress (for public access)

```bash
kubectl apply -f k3s/ingress.yaml -n chat-widget
```

## Step 8: Verify Deployment

```bash
# Check all resources
kubectl get all -n chat-widget

# Check ingress
kubectl get ingress -n chat-widget

# View logs
kubectl logs -n chat-widget -l app=backend
kubectl logs -n chat-widget -l app=frontend
```

## Step 9: Access Your App

- Frontend: `http://13.232.3.204/`
- Backend API: `http://13.232.3.204/api/`

## Useful Commands

```bash
# Scale replicas
kubectl scale deployment backend --replicas=3 -n chat-widget

# Check pod status
kubectl get pods -n chat-widget

# Delete deployment
kubectl delete namespace chat-widget
```

## Using Jenkins for CI/CD with K3s

See `Jenkinsfile` for automated K3s deployments.
