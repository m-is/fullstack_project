import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Location } from "../entities/Location.js";

export class LocationSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		em.create(Location, {
			user: context.user1,
			name: "farm"
		});
		em.create(Location, {
			user: context.user2,
			name: "farm"
		});
		em.create(Location, {
			user: context.user3,
			name: "farm"
		});
		em.create(Location, {
			user: context.user4,
			name: "farm"
		});
	}
}
