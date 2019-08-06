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
                    sh 'pm2 start hello.js'
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
