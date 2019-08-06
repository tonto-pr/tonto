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
