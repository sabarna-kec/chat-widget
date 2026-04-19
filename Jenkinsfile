pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "chat-widget-backend:${BUILD_NUMBER}"
        FRONTEND_IMAGE = "chat-widget-frontend:${BUILD_NUMBER}"
        K3S_SERVER = "13.232.3.204"
        K3S_KUBECONFIG = "/var/lib/jenkins/.kube/config"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sabarna-kec/chat-widget.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    sh '''
                        docker build -t ${BACKEND_IMAGE} .
                        docker tag ${BACKEND_IMAGE} chat-widget-backend:latest
                    '''
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    sh '''
                        docker build -t ${FRONTEND_IMAGE} .
                        docker tag ${FRONTEND_IMAGE} chat-widget-frontend:latest
                    '''
                }
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
            }sudo k3s kubectl set image deployment/backend backend=${BACKEND_IMAGE} -n chat-widget --kubeconfig=${K3S_KUBECONFIG}
                    
                    # Update frontend deployment with new image
                    sudo k3s kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE} -n chat-widget --kubeconfig=${K3S_KUBECONFIG}
                    
                    # Wait for rollout to complete
                    sudo k3s kubectl rollout status deployment/backend -n chat-widget --kubeconfig=${K3S_KUBECONFIG}
                    sudo k3s kubectl rollout status deployment/frontend -n chat-widget --kubeconfig=${K3S_KUBECONFIG}
                    sudo k3s kubectl get deployments -n chat-widget --kubeconfig=${K3S_KUBECONFIG}
                    echo "=== Pod Status ==="
                    sudo k3s kubectl get pods -n chat-widget --kubeconfig=${K3S_KUBECONFIG}
                    echo "=== Services ==="
                    sudo k3s kubectl get svc -n chat-widget --kubeconfig=${K3S_KUBECONFIG}
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
