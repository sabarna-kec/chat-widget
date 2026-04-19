pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "chat-widget-backend:${BUILD_NUMBER}"
        FRONTEND_IMAGE = "chat-widget-frontend:${BUILD_NUMBER}"
        K3S_KUBECONFIG = "/var/lib/jenkins/.kube/config"
        K3S_NAMESPACE = "chat-widget"
    }

    stages {
        stage('🔄 Checkout Code') {
            steps {
                echo "📥 Cloning repository..."
                git branch: 'main', url: 'https://github.com/sabarna-kec/chat-widget.git'
            }
        }

        stage('🐳 Build Backend Image') {
            steps {
                echo "🔨 Building backend Docker image..."
                dir('backend') {
                    sh '''
                        docker build -t $BACKEND_IMAGE .
                        docker tag $BACKEND_IMAGE chat-widget-backend:latest
                        echo "✅ Backend image built: $BACKEND_IMAGE"
                    '''
                }
            }
        }

        stage('🐳 Build Frontend Image') {
            steps {
                echo "🔨 Building frontend Docker image..."
                dir('frontend') {
                    sh '''
                        docker build -t $FRONTEND_IMAGE .
                        docker tag $FRONTEND_IMAGE chat-widget-frontend:latest
                        echo "✅ Frontend image built: $FRONTEND_IMAGE"
                    '''
                }
            }
        }

        stage('⚙️ Initial K3s Setup') {
            steps {
                echo "🚀 Creating K3s infrastructure..."
                sh '''
                    export KUBECONFIG=$K3S_KUBECONFIG
                    
                    # Create ConfigMap
                    kubectl apply -f k3s/configmap.yaml -n $K3S_NAMESPACE
                    
                    # Create Services
                    kubectl apply -f k3s/backend-service.yaml -n $K3S_NAMESPACE
                    kubectl apply -f k3s/frontend-service.yaml -n $K3S_NAMESPACE
                    
                    # Create Ingress
                    kubectl apply -f k3s/ingress.yaml -n $K3S_NAMESPACE
                    
                    echo "✅ K3s infrastructure ready"
                '''
            }
        }

        stage('📦 Deploy to K3s') {
            steps {
                echo "🚀 Deploying applications..."
                sh '''
                    export KUBECONFIG=$K3S_KUBECONFIG
                    
                    echo "📝 Deploying backend..."
                    kubectl apply -f k3s/backend-deployment.yaml -n $K3S_NAMESPACE
                    
                    echo "📝 Deploying frontend..."
                    kubectl apply -f k3s/frontend-deployment.yaml -n $K3S_NAMESPACE
                    
                    echo "⏳ Waiting for rollout (2 min timeout)..."
                    kubectl rollout status deployment/backend -n $K3S_NAMESPACE --timeout=2m
                    kubectl rollout status deployment/frontend -n $K3S_NAMESPACE --timeout=2m
                '''
            }
        }

        stage('🔄 Update Images') {
            steps {
                echo "🔄 Updating with new images..."
                sh '''
                    export KUBECONFIG=$K3S_KUBECONFIG
                    
                    kubectl set image deployment/backend backend=$BACKEND_IMAGE -n $K3S_NAMESPACE
                    kubectl set image deployment/frontend frontend=$FRONTEND_IMAGE -n $K3S_NAMESPACE
                    
                    echo "⏳ Waiting for pods to restart..."
                    kubectl rollout status deployment/backend -n $K3S_NAMESPACE --timeout=2m
                    kubectl rollout status deployment/frontend -n $K3S_NAMESPACE --timeout=2m
                '''
            }
        }

        stage('✅ Verify') {
            steps {
                echo "🔍 Verifying deployment..."
                sh '''
                    export KUBECONFIG=$K3S_KUBECONFIG
                    
                    echo "📊 Deployments:"
                    kubectl get deployments -n $K3S_NAMESPACE
                    
                    echo "🐳 Pods:"
                    kubectl get pods -n $K3S_NAMESPACE
                    
                    echo "🌐 Services:"
                    kubectl get svc -n $K3S_NAMESPACE
                    
                    echo "✅ Deployment verified!"
                '''
            }
        }
    }

    post {
        always {
            echo "🏁 Pipeline complete!"
        }
        success {
            echo "✅ SUCCESS! App deployed to K3s"
        }
        failure {
            echo "❌ FAILED! Check logs above"
        }
    }
}
