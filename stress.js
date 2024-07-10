const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const pidusage = require('pidusage');

// Function to perform an optimized CPU-intensive task (Fibonacci calculation)
function fibonacci(n) {
    let a = 0, b = 1;
    for (let i = 0; i < n; i++) {
        let temp = a;
        a = b;
        b = temp + b;
    }
    return a;
}

// Function to allocate a large amount of memory in chunks
function memoryHog(size) {
    const chunkSize = 1e6; // Chunk size to allocate memory incrementally
    const bigArray = [];

    for (let i = 0; i < size; i += chunkSize) {
        const chunk = Array.from({ length: Math.min(chunkSize, size - i) }, () => ({ index: i, value: Math.random() }));
        bigArray.push(chunk);
    }

    console.log('Memory allocation complete, size:', size);
    return bigArray;
}

if (isMainThread) {
    let fibonacciSize = 25; // Initial Fibonacci size
    let memorySize = 1e6; // Initial memory allocation size (1 million objects)
    const numWorkers = 4; // Number of worker threads
    let workers = [];

    // Function to create and manage worker threads
    function createWorker(size) {
        const worker = new Worker(__filename, { workerData: { fibonacciSize: size, memorySize: size } });
        worker.on('message', (msg) => {
            console.log(`Worker finished: ${msg}`);
        });
        worker.on('error', (err) => {
            console.error('Worker error:', err);
        });
        worker.on('exit', (code) => {
            console.log(`Worker exited with code ${code}`);
            if (code !== 0) {
                createWorker(size); // Restart worker if it crashes
            }
        });
        return worker;
    }

    // Create initial workers
    for (let i = 0; i < numWorkers; i++) {
        workers.push(createWorker(fibonacciSize));
    }

    // Increase workload periodically
    setInterval(() => {
        fibonacciSize += 1; // Increase Fibonacci size
        memorySize += 1e6; // Increase memory size (1 million objects)
        workers.push(createWorker(fibonacciSize));
        console.log(`Increased workload: Fibonacci size ${fibonacciSize}, Memory size ${memorySize}`);
    }, 5000);

    // Monitor and log CPU and memory usage every second
    setInterval(() => {
        pidusage(process.pid, (err, stats) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`CPU: ${stats.cpu.toFixed(2)}%, Memory: ${(stats.memory / (1024 * 1024)).toFixed(2)} MB`);
        });
    }, 1000);

} else {
    const { fibonacciSize, memorySize } = workerData;

    // Perform the CPU intensive task
    const fibResult = fibonacci(fibonacciSize);
    console.log(`Fibonacci(${fibonacciSize}) result: ${fibResult}`);

    // Allocate memory in chunks
    memoryHog(memorySize);

    // Notify that the worker has finished its task
    parentPort.postMessage(`Worker completed Fibonacci(${fibonacciSize}) and memory allocation of size ${memorySize}`);
}
