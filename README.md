# Local build and push docker image command
docker buildx build --platform linux/amd64 -t docker-hosted.sumerge.com/demos/corporate-account-opening:0.0.2 --push .
