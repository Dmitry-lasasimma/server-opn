export const messages = {
	BAD_REQUEST: {
		code: "EV-400",
		message: "Bad Request"
	},
	NOT_FOUND: {
		code: "EV-404",
		message: "Not Found"
	},
	UNAUTHORIZED: {
		code: "EV-401",
		message: "Unauthorized"
	},
	FORBIDDEN: {
		code: "EV-403",
		message: "Forbidden"
	},
	INTERNAL_SERVER_ERROR: {
		code: "EV-500",
		message: "Internal Server Error"
	},
	BAD_GATEWAY: {
		code: "EV-502",
		message: "Bad Gateway"
	},
	SERVICE_UNAVAILABLE: {
		code: "EV-503",
		message: "Service Unavailable"
	},
	SUCCESSFULLY: {
		code: "EV-200",
		message: "Successfully"
	},
	USER_ALREADY_EXISTS: {
		code: "EV-409",
		message: "User already exists"
	},
	CREATE_SUCCESSFUL: {
		code: "EV-201",
		message: "Create successful"
	},
	TOKEN_EXPIRED: {
		code: "EV-419",
		message: "Token expired"
	},
	INVALID_CARD: {
		code: "EV-420",
		message: "Card validation failed"
	},
	TOKEN_NOT_FOUND: {
		code: "EV-421",
		message: "Token not found"
	},
	OMISE_ERROR: {
		code: "EV-422",
		message: "Omise API error"
	},
	TAX_INFO_NOT_FOUND: {
		code: "EV-423",
		message: "User tax info not found"
	},
	COUPON_NOT_FOUND: {
		code: "EV-424",
		message: "COUPON_NOT_FOUND",
		detail: "Coupon not found"
	},
	COUPON_ALREADY_EXPIRED: {
		code: "EV-425",
		message: "COUPON_ALREADY_EXPIRED",
		detail: "Coupon already expired"
	},
	COUPON_ALREADY_USED: {
		code: "EV-426",
		message: "COUPON_ALREADY_USED",
		detail: "Coupon already used"
	},
	NAME_ALREADY_EXISTED: {
		code: "EV-421235",
		message: "This package's name already existed"
	},
	INSUFFICIENT_POINT: {
		code: 'EV-210105',
		message: "Insufficient points"
	},
};

export interface IErrorResponse {
	code: string;
	message: string;
	detail?: string;
}
