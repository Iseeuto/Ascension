import { validationResult } from "express-validator";
 
export function BuildError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}
 
export async function validateFields(rules, req, res) {
    for (const rule of rules) {
        await rule.run(req);
    }
 
    const errors = validationResult(req);
 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
    return null;
}
 