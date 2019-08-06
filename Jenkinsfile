pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                script {
                    sh 'pwd'
                    sh 'ls -la && cd .. && ls -la'
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
