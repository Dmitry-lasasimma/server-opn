"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateDefaultCard = void 0;
const config_1 = require("../config");
// export const validateUpdateDefaultCard = (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction,
// ): void => {
// 	const { paymentMethodId } = req.body;
// 	if (!paymentMethodId) {
// 		res.status(400).json({
// 			message: messages.BAD_REQUEST,
// 			detail: "Missing required fields: paymentMethodId",
// 		});
// 	}
// 	next();
// };
const validateUpdateDefaultCard = (req, res, next) => {
    const id = req.params.id;
    // const { id } = req.query; // Extracting the 'id' from the query string
    if (!id || typeof id !== "string") {
        res.status(400).json({
            message: config_1.messages.BAD_REQUEST,
            detail: "Missing required fields: paymentMethodId",
        });
    }
    next();
};
exports.validateUpdateDefaultCard = validateUpdateDefaultCard;
