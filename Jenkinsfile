pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                script {
                    sh 'yarn install'
                    sh 'pm2 stop index'
                    sh 'pm2 start src/server/index.js'
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
