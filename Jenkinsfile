pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/Nassa-nista/healeasy.git'
      }
    }
    stage('Build (npm ci)') {
      steps {
        bat 'npm --version'
        bat 'npm ci'
      }
    }
    stage('Test') {
      steps {
        bat 'set NODE_ENV=test && set HEALEASY_DB=:memory: && npm test -- --runInBand --detectOpenHandles'
      }
    }
    stage('Docker build') {
      steps {
        bat 'docker --version'
        bat 'docker compose version'
        bat 'docker compose -f docker-compose.staging.yml build'
      }
    }
    stage('Run container') {
      steps {
        bat 'docker compose -f docker-compose.staging.yml up -d'
        bat 'docker compose -f docker-compose.staging.yml ps'
      }
    }
  }

  post {
    always {
      catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
        junit 'junit.xml'
      }
      archiveArtifacts allowEmptyArchive: true, artifacts: 'junit.xml'
    }
  }
}
