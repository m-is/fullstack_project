import { Entity, Property, Unique, Collection, PrimaryKey, OneToOne } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core"
import { User } from "./User.js"

/*
Inventory for a specific user, tracks their inventory in-game
Items are bools, true for acquired, false for not acquired/used/broken/etc.
																		        (items can be lost in different ways)
 */


@Entity()
export class Inventory {
	//Inventory is tied to one specific user, a user may not have two inventories
	@PrimaryKey()
	user!: Rel<User>;
	
	//Shovel item, found at the farm when inspecting the shed
	@Property()
	shovel: boolean = false;
	
	//Lucky coin item, found at the city center when inspecting the fountain
	@Property()
	luckyCoin: boolean = false;
}
