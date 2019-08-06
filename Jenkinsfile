pipeline {
    agent any
    environment {
        BUILD_ID=123
    }
    stages {
        stage('Build') {
            environment {
                BUILD_ID=123
            }
            steps {
                script {
                    sh 'pwd'
                    sh 'pm2 start hello.js'
                }
            }
        }
        stage('Test') {
            environment {
                BUILD_ID=123
            }
            steps {
                script {
                    sh 'pm2 list'
                }
            }
        }
        stage('Deploy') {
            environment {
                BUILD_ID=123
            }
            steps {
                script {
                    echo 'Deploying'
                }
            }
        }
    }
}
