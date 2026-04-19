# Local Docker Images Setup (No Docker Hub)

This guide uses **local Docker images** built on your EC2 instance. No need for Docker Hub or any registry!

## 🎯 How It Works

```
Jenkins
  ↓
1. Builds Docker images locally
  ├─ backend Docker image
  └─ frontend Docker image
  ↓
2. Tags images with latest & build number
  ├─ chat-widget-backend:123
  ├─ chat-widget-backend:latest
  ├─ chat-widget-frontend:123
  └─ chat-widget-frontend:latest
  ↓
3. K3s pulls from local Docker daemon
  (imagePullPolicy: Never)
  ↓
4. Pods start with local images
```

## 📋 Setup Steps

### Step 1: Deploy K3s on EC2

```bash
# SSH into EC2
ssh -i chat-widget-key.pem ec2-user@<YOUR_EC2_IP>

# Clone your repo
git clone https://github.com/YOUR-USERNAME/chat-widget.git
cd chat-widget

# Make setup script executable
chmod +x setup-k3s-jenkins.sh

# Run setup (installs K3s for Amazon Linux)
./setup-k3s-jenkins.sh
```

The script will:

- ✅ Install K3s
- ✅ Create namespace
- ✅ Setup kubeconfig for Jenkins
- ✅ Auto-detect your EC2 IP
- ✅ Update ConfigMap with your IP

### Step 2: Initial Manual Deployment

```bash
# Deploy configs
sudo k3s kubectl apply -f k3s/configmap.yaml -n chat-widget
sudo k3s kubectl apply -f k3s/backend-deployment.yaml -n chat-widget
sudo k3s kubectl apply -f k3s/backend-service.yaml -n chat-widget
sudo k3s kubectl apply -f k3s/frontend-deployment.yaml -n chat-widget
sudo k3s kubectl apply -f k3s/frontend-service.yaml -n chat-widget
sudo k3s kubectl apply -f k3s/ingress.yaml -n chat-widget

# Verify
sudo k3s kubectl get pods -n chat-widget
```

### Step 3: Setup Jenkins

```bash
# On EC2, install Jenkins
sudo amazon-linux-extras install java-openjdk11 -y
sudo yum install -y jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# Access at: http://<YOUR_EC2_IP>:8080
```

### Step 4: Configure Jenkins Pipeline

1. Jenkins Dashboard → New Item
2. Name: `chat-widget`
3. Type: `Pipeline`
4. Check: "GitHub project"
5. Under "Build Triggers" → Check "GitHub hook trigger"
6. Under "Pipeline":
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/YOUR-USERNAME/chat-widget.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
7. Save

### Step 5: Setup GitHub Webhook

1. Go to your GitHub repo → Settings → Webhooks
2. Click "Add webhook"
3. Payload URL: `http://<YOUR_EC2_IP>:8080/github-webhook/`
4. Events: `Push events`
5. Add webhook

## 🚀 Now Whenever You Push Code

```
git push origin main
    ↓
GitHub webhook triggers Jenkins
    ↓
Jenkins runs:
  1. Clone code
  2. Build backend Docker image (locally)
  3. Build frontend Docker image (locally)
  4. Update K3s deployments with new images
  5. Wait for rollout
  6. Verify pods running
    ↓
Your app is updated! 🎉
```

## 📊 Key Configuration Changes

### imagePullPolicy: Never

In `k3s/backend-deployment.yaml` and `k3s/frontend-deployment.yaml`:

```yaml
containers:
  - name: backend
    image: chat-widget-backend:latest
    imagePullPolicy: Never # ← Use local images only
```

This tells K3s: "Don't try to pull from registry, use images available on this node"

### No Registry Push

Jenkinsfile no longer has the "Push to K3s Registry" stage. Images stay local!

```groovy
// ❌ REMOVED - No more pushing to registry
stage('Push to K3s Registry') { ... }

// ✅ Images built locally and used directly
stage('Build Backend Docker Image') {
    sh 'docker build -t ${BACKEND_IMAGE} .'
}
```

## 🔧 Useful Commands

```bash
# View pods
sudo k3s kubectl get pods -n chat-widget

# View logs
sudo k3s kubectl logs -n chat-widget -l app=backend
sudo k3s kubectl logs -n chat-widget -l app=frontend

# Describe pod (for troubleshooting)
sudo k3s kubectl describe pod <pod-name> -n chat-widget

# Delete all and restart
sudo k3s kubectl delete namespace chat-widget
sudo k3s kubectl create namespace chat-widget
sudo k3s kubectl apply -f k3s/*.yaml -n chat-widget

# Check image locally
docker images | grep chat-widget
```

## 🐛 Troubleshooting

### Pods stuck in ImagePullBackOff?

```bash
# Check if image exists locally
docker images

# If missing, build manually:
cd backend && docker build -t chat-widget-backend:latest .
cd ../frontend && docker build -t chat-widget-frontend:latest .
```

### Jenkins can't find images?

```bash
# Ensure Docker socket is accessible
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### kubeconfig permission denied?

```bash
# Verify kubeconfig ownership
ls -la /var/lib/jenkins/.kube/config
sudo chown jenkins:jenkins /var/lib/jenkins/.kube/config
sudo chmod 600 /var/lib/jenkins/.kube/config
```

## 📝 Summary: Local vs Registry

| Feature               | Local (This Setup) | Docker Hub/Registry |
| --------------------- | ------------------ | ------------------- |
| **Registry required** | ❌ No              | ✅ Yes              |
| **Build & push**      | ❌ Only build      | ✅ Build + push     |
| **Speed**             | ✅ Fast            | ⚠️ Slower           |
| **Multi-server**      | ❌ Limited         | ✅ Easy             |
| **Cost**              | ✅ Free            | ⚠️ Free tier ok     |
| **Perfect for**       | Single EC2         | Multi-node clusters |

Perfect for your single EC2 deployment! 🎯
