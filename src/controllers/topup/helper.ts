interface TopupFilter {
	packageName?: string | RegExp;
	type?: string;
	isAvailable?: boolean;
	price?: { $gte?: number; $lte?: number };
	credit?: { $gte?: number; $lte?: number };
	createdAt?: { $gte?: Date; $lte?: Date };
}

/**
 * Filters Topup fields based on query parameters.
 * @param query - The request query object.
 * @returns A filter object for MongoDB queries.
 */
export const filterTopupFields = (query: any): TopupFilter => {
	let filter: TopupFilter = {};

	// Filter by packageName
	if (query.packageName) {
		filter = {
			...filter,
			packageName: new RegExp(query.packageName, "i"), // Case-insensitive search
		};
	}

	// Filter by type (NORMAL or PROMOTION)
	if (query.type) {
		filter = {
			...filter,
			type: query.type,
		};
	}

	// Filter by price range
	if (query.minPrice || query.maxPrice) {
		filter = {
			...filter,
			price: {
				...(query.minPrice && { $gte: Number(query.minPrice) }),
				...(query.maxPrice && { $lte: Number(query.maxPrice) }),
			},
		};
	}

	// Filter by credit range
	if (query.minCredit || query.maxCredit) {
		filter = {
			...filter,
			credit: {
				...(query.minCredit && { $gte: Number(query.minCredit) }),
				...(query.maxCredit && { $lte: Number(query.maxCredit) }),
			},
		};
	}

	// Filter by createdAt range
	if (query.startDate || query.endDate) {
		filter = {
			...filter,
			createdAt: {
				...(query.startDate && { $gte: new Date(query.startDate) }),
				...(query.endDate && { $lte: new Date(query.endDate) }),
			},
		};
	}

	if (query.isAvailable) {
		filter = {
			...filter,
			isAvailable: query.isAvailable,
		};
	}

	return filter;
};


export const generateTopupId = (): string => {
	const now = new Date();

	// Extract date components
	const month = String(now.getMonth() + 1).padStart(2, '0'); // Month (1-12), padded to 2 digits
	const day = String(now.getDate()).padStart(2, '0'); // Day, padded to 2 digits
	const hours = String(now.getHours()).padStart(2, '0'); // Hours, padded to 2 digits
	const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutes, padded to 2 digits
	const seconds = String(now.getSeconds()).padStart(2, '0'); // Seconds, padded to 2 digits
	const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Milliseconds, padded to 3 digits

	// Combine components to create a unique ID
	return `${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
};