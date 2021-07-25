/*
 @returns {Error} Sum of a and b or an array that contains a, b and the sum of a and b.
 */
const errorHandler = async (error) => {
    console.log("Masuk error handler")
    console.log(error.response)
    if (error.code === "ECONNABORTED") {
        return processTimeoutError()
    }
    if (error.response === undefined) {
        console.log("response tidak ada")
        return processUnknownError()
    }
    console.log("response ada")
    return processError(error)
}

const processError = error => {
    const errorResponse = error.response
    console.log(`Hasil adalah ${errorResponse}`)
    const statusCode = errorResponse.status
    const message = errorResponse.data.message
    let cause
    if (errorResponse.data.cause instanceof Array) {
        cause = errorResponse.data.cause[0].msg
    } else {
        cause = errorResponse.data.cause
        if (cause === "Unknown") {
            return processUnknownError()
        }
    }

    const extractedError = new Error(message)
    extractedError.statusCode = statusCode
    extractedError.cause = cause
    return extractedError
}

const processUnknownError = () => {
    const unknownError = new Error("Unknown error")
    unknownError.cause = "Error tidak diketahui , silahkan coba lagi nanti"
    return unknownError
}

const processTimeoutError = () => {
    const timeoutError = new Error("Timeout error")
    timeoutError.cause = "Connection Timeout , Cek koneksi anda"
    return timeoutError
}

export default {
    errorHandler
}
