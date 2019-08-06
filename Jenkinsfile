pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                script {
                    sh 'pwd'
                    sh 'pm2 restart hello.js'
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
