pipeline {
    agent any
    environment {
        BUILD_ID=123
    }
    stages {
        stage('Build') {
            steps {
                script {
                    sh 'pwd'
                    sh 'BUILD_ID=dontKillMe pm2 start hello.js'
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
