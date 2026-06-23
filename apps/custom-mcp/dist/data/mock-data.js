export const SERVERS = [
    {
        id: "srv-1",
        name: "api-prod",
        status: "healthy",
    },
    {
        id: "srv-2",
        name: "worker-prod",
        status: "healthy",
    },
    {
        id: "srv-3",
        name: "staging",
        status: "degraded",
    },
];
export const LOGS = {
    "srv-1": "API server healthy. CPU 67%. Memory 86%.",
    "srv-2": "Worker queue processing normally.",
    "srv-3": "Elevated error rate detected.",
};
