export function parseErrorFromWebApi(obj: any): string[]{
    const err = obj.error.errors;

    let errorMessages: string[] = [];

    for(let field in err) {
        const messageWithFields = err[field].map((message: string) => `${field}: ${message}`);
        errorMessages = errorMessages.concat(messageWithFields);
    }
    return errorMessages;
}