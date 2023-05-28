import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/User.js";

export class UserSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		context.user1 = em.create(User, {
			username: "Spot",
			email: "email@email.com",
			password: "spotPassword",
		});

		context.user2 = em.create(User, {
			username: "Dogbert",
			email: "email2@email.com",
			password: "dogbertRULES",
		});

		context.user3 = em.create(User, {
			username: "Doglord",
			email: "email3@email.com",
			password: "password123",
		});

		context.user4 = em.create(User, {
			username: "NotaDog",
			email: "email4@email.com",
			password: "asdf2342",
		});
	}
}
