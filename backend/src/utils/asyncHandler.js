export const asyncHandler = (requestHandler) => async (req , res , next) =>{
    try {
        // Execute a Request Handler
        requestHandler(req , res, next);
    } catch (error) {
        next(error);
    }
}

