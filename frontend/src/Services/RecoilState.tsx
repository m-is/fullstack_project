import { atom } from "recoil";

export const playerInfo = atom({
	key: "playerInfo",
	default: {
		email: null,
		locations: null,
		inventory: null
	},
});

export const locInfo = atom({
	key: "locationInfo",
	default: []
});

export const invenInfo = atom({
	key: "inventoryInfo",
	default: []
});
