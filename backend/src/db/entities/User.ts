import { Entity, Property, Unique, OneToMany, Collection, Cascade, PrimaryKey, OneToOne } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core"
import { BaseEntity } from "./BaseEntity.js";
import { Inventory } from "./Inventory.js";
import { LocationHistory } from "./LocationHistory.js";
//import { Match } from "./Match.js";

@Entity({ tableName: "users" })
export class User extends BaseEntity {
	@Property()
	@PrimaryKey()
	@Unique()
	email!: string;

	@Property()
	username!: string;
	
	@Property()
	password!: string;

	/*
	@OneToMany(() => Match, (match) => match.owner, { cascade: [Cascade.PERSIST, Cascade.REMOVE] })
	matches!: Collection<Match>;

	@OneToMany(() => Match, (match) => match.matchee, { cascade: [Cascade.PERSIST, Cascade.REMOVE] })
	matched_by!: Collection<Match>;
	*/
	@OneToOne({entity:() => Inventory})
	items!: Rel<Inventory>;
	
	@OneToOne({entity: () => LocationHistory})
	map!: Rel<LocationHistory>;
	
  /* HW 1 NOTE!  We do NOT add Messages here!  This is the reason
   some of you needed Rel<> in your submission.  I gave an
   exhaustive explanation in Discord here:
   https://discord.com/channels/1092372291112931330/1092372291670786110/1103471051926667384
  */
}
