import {Request, Response, NextFunction, ErrorRequestHandler} from "express";

const error_handler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    res.status(500).json({
        success: false,
        message: "Application Failed, we're working on it. Please try again later."
    })
}

export {error_handler}
