pipeline {
    agent { label 'agent-laptop-2' }

    environment {
        // This is where Jenkins pulls the code on Laptop 2
        PROJECT_DIR = "${WORKSPACE}" 
    }

    stages {
	stage('Pre-flight Check') {
            steps {
                // This will tell us exactly what the agent sees
                sh 'whoami'
                sh 'docker --version'
                sh 'docker compose version'
            }
        }
        stage('Cleanup Environment') {
   	    steps {
        	dir("${env.PROJECT_DIR}") {
            	echo 'Force removing existing guestbook containers to prevent naming conflicts...'
            	// This stops the project Jenkins knows about
            	sh 'docker compose down || true' 
            
            	// This is the "Nuclear Option": 
            	// It force-removes any container named guestbook-db, backend, or frontend 
            	// even if they were started manually earlier.
            	sh 'docker rm -f guestbook-db guestbook-backend guestbook-frontend guestbook-gateway || true'
            
            	sh 'docker image prune -f'
        	}
    	    }
	}

        stage('Database Tier') {
            steps {
                dir("${env.PROJECT_DIR}") {
                    echo 'Starting MongoDB...'
                    sh 'docker compose up -d mongodb'
                    // Give Mongo 10 seconds to initialize its internal files
                    sh 'sleep 10' 
                }
            }
        }

        stage('Build & Deploy Apps') {
            parallel {
                stage('Backend Service') {
                    steps {
                        dir("${env.PROJECT_DIR}") {
                            echo 'Building Spring Boot Backend...'
                            sh 'docker compose build backend'
                            sh 'docker compose up -d backend'
                        }
                    }
                }
                stage('Frontend & Gateway') {
                    steps {
                        dir("${env.PROJECT_DIR}") {
                            echo 'Building React & Nginx...'
                            sh 'docker compose build frontend gateway'
                            sh 'docker compose up -d frontend gateway'
                        }
                    }
                }
            }
        }

        stage('Final Verification') {
            steps {
                sh 'docker ps'
                echo 'Guestbook is live at http://localhost'
            }
	}
    }
}
