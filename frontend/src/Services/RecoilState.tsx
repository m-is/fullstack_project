import { atom } from "recoil";

export const playerInfo = atom({
	key: "playerInfo",
	default: {
		email: null,
		locations: null,
		inventory: null
	},
});
