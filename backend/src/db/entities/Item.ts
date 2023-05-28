import { Entity, Property, Unique, Collection, PrimaryKey, OneToOne, ManyToOne } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core"
import { User } from "./User.js"

/*
Item for a specific user, tracks their inventory in-game
Items are bools, true for acquired, false for not acquired/used/broken/etc.
																		        (items can be lost in different ways)
 */


//Lucky coin item, found at the city center when inspecting the fountain
//Shovel item, found at the farm when inspecting the shed
@Entity()
export class Item {
	//Item is tied to one specific user, a user may not have two inventories
	@ManyToOne({primary: true})
	user!: Rel<User>;
	
	@PrimaryKey()
	name: string;
}
