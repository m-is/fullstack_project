import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import bcrypt from "bcrypt";
import { User } from "../entities/User.js";

export class UserSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		
		const hashedPw = await bcrypt.hash("password", 10);
		context.user1 = em.create(User, {
			username: "Spot",
			email: "email@email.com",
		});

		context.user2 = em.create(User, {
			username: "Dogbert",
			email: "email2@email.com",
		});

		context.user3 = em.create(User, {
			username: "Doglord",
			email: "email3@email.com",
		});

		context.user4 = em.create(User, {
			username: "NotaDog",
			email: "email4@email.com",
		});
	}
}
