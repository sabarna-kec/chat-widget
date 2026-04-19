pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "localhost:5000"  // K3s built-in registry
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/chat-widget-backend:${BUILD_NUMBER}"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/chat-widget-frontend:${BUILD_NUMBER}"
        K3S_SERVER = "13.232.3.204"
        K3S_KUBECONFIG = "/home/jenkins/.kube/config"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo/chat-widget.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t ${BACKEND_IMAGE} .'
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    sh 'docker build -t ${FRONTEND_IMAGE} .'
                }
            }
        }

        stage('Push to K3s Registry') {
            steps {
                sh '''
                    docker push ${BACKEND_IMAGE}
                    docker push ${FRONTEND_IMAGE}
                '''
            }
        }

        stage('Update K3s Deployment') {
            steps {
                sh '''
                    export KUBECONFIG=${K3S_KUBECONFIG}
                    
                    # Update backend deployment with new image
                    kubectl set image deployment/backend backend=${BACKEND_IMAGE} -n chat-widget
                    
                    # Update frontend deployment with new image
                    kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE} -n chat-widget
                    
                    # Wait for rollout to complete
                    kubectl rollout status deployment/backend -n chat-widget
                    kubectl rollout status deployment/frontend -n chat-widget
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    export KUBECONFIG=${K3S_KUBECONFIG}
                    echo "=== Deployment Status ==="
                    kubectl get deployments -n chat-widget
                    echo "=== Pod Status ==="
                    kubectl get pods -n chat-widget
                    echo "=== Services ==="
                    kubectl get svc -n chat-widget
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline completed!"
        }
        success {
            echo "✅ Deployment successful! App available at http://${K3S_SERVER}/"
        }
        failure {
            echo "❌ Deployment failed. Check logs above."
        }
    }
}
