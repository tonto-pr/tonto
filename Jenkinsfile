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
                    sh 'sops -d --output-type json ./secrets/encrypted/variables.json > ./secrets/decrypted/variables.json'
                }
            }
        }
        stage('Run tests') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.ci.yml up --abort-on-container-exit'
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
            when {
                expression {
                return env.BRANCH_NAME == 'master'
                }
            }
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
            when {
                expression {
                return env.BRANCH_NAME == 'master'
                }
            }
            steps {
                script {
                    sh 'docker-compose up -d'
                }
            }
        }
    }
}
