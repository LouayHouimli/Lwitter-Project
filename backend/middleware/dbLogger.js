let dbConnectionCount = 0;

const dbLogger = (req, res, next) => {
    // Assuming you have a function to check DB connection
    if (checkDbConnection()) {
        dbConnectionCount++;
        console.log(`Database Connection #${dbConnectionCount}`);
    }
    next();
};

const checkDbConnection = () => {
    // Implement your logic to check DB connection
    return true; // Placeholder
};

export default dbLogger;