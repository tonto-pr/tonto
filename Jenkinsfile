pipeline {
    agent any
    stages {
        stage('Install packages') {
            steps {
                script {
                    sh 'yarn install'
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
