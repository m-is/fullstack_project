import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/User.js";

export class UserSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		em.create(User, {
			username: "Spot",
			email: "email@email.com",
			password: "spotPassword"
		});

		em.create(User, {
			username: "Dogbert",
			email: "email2@email.com",
			password: "dogbertRULES"
		});

		em.create(User, {
			username: "Doglord",
			email: "email3@email.com",
			password: "password123"
		});

		em.create(User, {
			username: "NotaDog",
			email: "email4@email.com",
			password: "asdf2342``"
		});
	}
}
