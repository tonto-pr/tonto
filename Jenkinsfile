pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                script {
                    sh 'yarn install'
                    sh 'yarn generate'
                    sh 'pm2 stop index'
                    sh 'pm2 start yarn --interpreter bash --name api -- start-server'
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    sh 'pm2 list'
                }
            }
        }
        stage('Build user checker') {
            steps {
                wrap([$class: 'BuildUser']) {
                sh 'echo "${BUILD_USER}"'
                }
            }
        }
    }
}
