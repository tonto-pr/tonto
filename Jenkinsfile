pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                script {
                    sh 'ls -la'
                    sh 'cd ..'
                    sh 'ls -la'
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
