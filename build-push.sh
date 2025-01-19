#!/bin/bash

# Set variables
AWS_PROFILE="move-role"
AWS_REGION="ap-southeast-1"
AWS_ACCOUNT_ID="476114151154"
ECR_REPOSITORY="payment-service"
IMAGE_TAG="latest"

# Build the Docker image
echo "Building Docker image..."
docker buildx build --platform linux/amd64 -t ${ECR_REPOSITORY}:${IMAGE_TAG} .

# Tag the Docker image
echo "Tagging Docker image..."
docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}

# Log in to AWS ECR
echo "Logging in to AWS ECR..."
aws ecr get-login-password --region ${AWS_REGION} --profile ${AWS_PROFILE} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Push the Docker image to AWS ECR
echo "Pushing Docker image to AWS ECR..."
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}

echo "Build and push to AWS ECR completed successfully."
