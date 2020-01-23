/**
 * HttpError class used to be able to provide for consumers
 * a more usable errors from services. Would be used in the methods
 * to propagate error with http status code and with a message in
 * case if something went wrong during the request.
 * The HttpError class extends generic Error class from V8 and
 * adds property code for http status.
 */
export class HttpError extends Error {
    public readonly name: string;

    /**
     * Constructs a new HttpError.
     *
     * @param status
     * @param message
     */
    constructor(public status: number, public message: string) {
        super(message);
        this.name = "HttpError";
    }
}
