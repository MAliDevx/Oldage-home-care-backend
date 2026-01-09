
// Define the success response function
export const useSuccessResponse = async (
    res,
    message,
    data,
    statusCode = 200
) => {
    return res.status(statusCode).json({
        message,
        success: true,
        data,
    });
};

// Define the error response function
export const useErrorResponse = async (
    res,
    message,
    statusCode
)=> {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};

// Define the error response function
export const useInterServerErrorResponse = async (
    res,
    error,
) => {
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error
    });
};
