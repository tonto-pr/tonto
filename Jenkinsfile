pipeline {
    environment {
        registryCredential = 'dockerhub'
        dockerImage = "antoinert/tonto:$BUILD_NUMBER"
    }
    agent any
    stages {
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
                sh "docker rmi $dockerImage"
            }
        }
        stage('Generate necessary OpenAPI files') {
            steps {
                script {
                    sh 'yarn generate'
                }
            }
        }
        stage('Launch server') {
            steps {
                script {
                    sh 'docker run -d $registry:$BUILD_NUMBER'
                }
            }
        }
    }
}
