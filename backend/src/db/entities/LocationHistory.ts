import { Entity, Property, Unique, Collection, PrimaryKey, OneToOne} from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core"
import { User } from "./User.js"

/*
Locations information for an individual user, can be values 0, 1, 2
0: Undiscovered and unvisited, will not show on the main map
1: Discovered but unvisited, will show on main map but interaction buttons will not
	 appear until the user selects 'look around' in the location
2: Discovered and visited, will show on main map and show interaction buttons when
   visited.

user: this list will be tied to a user, it will reflect their location history
	    unique property because every user will have only 1 location history
 */


@Entity()
export class LocationHistory {
	//
	@PrimaryKey()
	user!: Rel<User>;
	
	//farm location will be discovered by default because it is the starting area
	@Property()
	farm: number = 1;
	
	//castlegate will be undiscovered/unvisited initially but will be discoverable
	//by looking around at the farm
	@Property()
	castleGate: number = 0;
	
	//outsideCastleWalls will be undiscovered/unvisited initially but will be discoverable
	//by looking around at the castlegate
	@Property()
	outsideCastleWalls: number = 0;
	
	//backstreets will be undiscovered/unvisited initially but will be discoverable
	//by using the shovel at the outsideCastleWalls location
	@Property()
	backstreets: number = 0;
	
	//towncenter will be undiscovered/unvisited initially but will be discoverable by
	//looking around in the backstreets
	@Property()
	townCenter: number = 0;
	
}
