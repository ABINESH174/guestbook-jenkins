pipeline {
    agent { label 'agent-laptop-2' }

    environment {
        // We're pointing to your existing K8s manifests
        K8S_DIR = "${WORKSPACE}/k8s" 
    }

    stages {
        stage('K8s Health Check') {
            steps {
                // Ensure the agent can actually talk to the cluster
                sh 'kubectl cluster-info'
                sh 'minikube status'
            }
        }

        stage('Build Images (Local Node)') {
            steps {
                script {
                    // This is CRITICAL: We point the terminal's docker env to Minikube's 
                    // internal docker registry so K8s can see the images we build.
                    sh 'eval $(minikube -p minikube docker-env) && docker build -t guestbook-backend:v1 ./backend'
                    sh 'eval $(minikube -p minikube docker-env) && docker build -t guestbook-frontend:v1 ./frontend'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Applying Manifests...'
                // Apply the DB, Services, Deployments, and Ingress
                sh "kubectl apply -f ${env.K8S_DIR}/"
            }
        }

        stage('Rollout Verification') {
            steps {
                echo 'Waiting for pods to stabilize...'
                sh 'kubectl rollout status deployment/guestbook-backend'
                sh 'kubectl rollout status deployment/guestbook-frontend'
                
                script {
                    // Final Green Flag check
                    sh 'kubectl get pods'
                    sh 'kubectl get svc'
                    echo "Application is accessible via Laptop 2 LAN IP at port 80"
                }
            }
        }
    }

    post {
        failure {
            echo 'Deployment failed. Fetching logs...'
            sh 'kubectl logs --tail=20 -l app=guestbook-backend'
        }
    }
}
