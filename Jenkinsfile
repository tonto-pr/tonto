pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                script {
                    sh 'pwd'
                    sh 'node hello.js'
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
