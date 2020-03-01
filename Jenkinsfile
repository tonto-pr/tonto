pipeline {
    environment {
        registry = "antoinert/tonto"
        registryCredential = 'dockerhub'
    }
    agent any
    stages {
        stage('Build image') {
            steps {
                script {
                    docker.build registry + ":$BUILD_NUMBER"
                }
            }
        }
        stage('Generate necessary OpenAPI files') {
            steps {
                script {
                    sh 'yarn generate'
                }
            }
        }
        stage('Launch server') {
            steps {
                script {
                    sh 'pm2 delete all'
                    sh 'pm2 start yarn --interpreter bash --name api -- start'
                }
            }
        }
    }
}
