import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Item } from "../entities/Item.js";

export class InventorySeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		em.create(Item, {
			user: context.user1,
			name: "shovel"
		});
		
		em.create(Item, {
			user: context.user2,
			name: "shovel"
		});
		
		em.create(Item, {
			user: context.user2,
			name: "luckyCoin"
		});
		
		em.create(Item, {
			user: context.user3,
			name: "shovel"
		});
		
	}
}
