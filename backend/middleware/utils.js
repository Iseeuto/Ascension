import { validationResult } from "express-validator"

export function BuildError(code, message) {
  let err = new Error(message);
  err.status = code;
  return err;
}

export function HasId(req, res, next) {
    const { id } = req.params;

    if (!id) throw BuildError(400, "Id is required.");

    next();
}

export async function validateFields(rules, req, res) {
  await Promise.all(rules.map((r) => r.run(req)));
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}