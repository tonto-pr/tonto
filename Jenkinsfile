pipeline {
    environment {
        registryCredential = 'dockerhub'
        dockerImage = "antoinert/tonto"
    }
    agent any
    stages {
        stage('Decrypt secrets') {
            steps {
                script {
                    sh 'sops --input-type dotenv -d -i .env'
                }
            }
        }
        stage('Build image') {
            steps {
                script {
                    sh 'docker-compose build web'
                }
            }
        }
        stage('Push image to image registry') {
            steps {
                script {
                    docker.withRegistry('', registryCredential) {
                        sh "docker push $dockerImage"
                    }
                }
            }
        }
        stage('Remove local docker image') {
            steps{
                sh "docker rmi -f $dockerImage"
            }
        }
        stage('Launch server') {
            steps {
                script {
                    sh 'docker-compose up -d'
                }
            }
        }
    }
}
