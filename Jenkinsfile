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
                    sh 'BUILD_ID=123 pm2 start hello.js'
                    sh 'pm2 save'
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
        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying'
                }
            }
        }
    }
}
