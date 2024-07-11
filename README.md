# Infinite Stress Script with Worker Threads

This project contains a Node.js application designed to perform CPU and memory-intensive tasks using worker threads. The application progressively increases its workload over time and runs indefinitely. It can be used to stress CPU and memory usage.

## Features

- Utilizes worker threads to distribute the workload across multiple threads.
- Performs CPU-intensive calculations (Fibonacci sequence).
- Allocates large amounts of memory in chunks.
- Monitors and logs CPU and memory usage periodically.
- Automatically increases the workload over time.

## Requirements

- Docker
- Node.js (for local development and testing)

## Installation

### Clone the Repository

```sh
git clone <repository-url>
cd nodeapp
```

## To Run Locally

```sh
npm install
node stress.js
```

## Containerizing the app

### Build the image

```sh
docker build -t node-app .
```

### Run the container

```sh
docker run --rm -d node-app
```

### Monitor logs

```sh
docker logs -f <container_id_or_name>
```

### Stop the container

```sh
docker stop <container_id_or_name>

```
