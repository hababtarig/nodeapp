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
    let intervalHandle = null;
    let lastWorker = null;

    // Function to perform CPU-intensive workload
    function performWorkload() {
        // Perform Fibonacci calculation in a worker thread
        const worker = new Worker(__filename, { workerData: fibonacciSize });
        worker.on('message', (result) => {
            console.log(`Fibonacci(${fibonacciSize}) result: ${result}`);
        });

        // Allocate memory in chunks
        const bigArray = memoryHog(memorySize);

        // Store reference to the last worker
        lastWorker = worker;
    }

    // Function to continuously increase workload
    function increaseWorkload() {
        // Increase Fibonacci size and memory size incrementally
        fibonacciSize += 1; // Adjust increment size as needed
        memorySize += 1e6; // Adjust increment size as needed (1 million objects)

        // Perform the workload
        performWorkload();
    }

    // Initial workload
    performWorkload();

    // Start increasing workload every 5 seconds (adjust interval as needed)
    intervalHandle = setInterval(increaseWorkload, 5000);

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
    // Perform the CPU intensive task in the worker thread
    parentPort.postMessage(fibonacci(workerData));
}
