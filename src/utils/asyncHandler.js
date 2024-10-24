// Middleware to handle asynchronous route handlers and automatically catch errors
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Resolve the provided request handler (which returns a promise) and catch any errors
        Promise.resolve(
            requestHandler(req, res, next) // Call the async request handler
        ).catch((err) => next(err)); // If an error occurs, pass it to the next middleware (error handler)
    };
};

export { asyncHandler }; // Export the asyncHandler function for use in routes
