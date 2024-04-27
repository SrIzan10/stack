"use server"

import { cookies } from "next/headers";
import { lucia, validateRequest } from ".";
import { redirect } from "next/navigation";
import prisma from "../db";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";

export async function logout() {
    const { session } = await validateRequest();
	await lucia.invalidateSession(session!.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/auth/signIn");
}

export async function login(prev: any, data: FormData) {
	const username = data.get("username");
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: "Invalid username",
			success: false,
		};
	}
	const password = data.get("password");
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		return {
			error: "Invalid password",
			success: false,
		};
	}

	const existingUser = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
	if (!existingUser) {
		// NOTE:
		// Returning immediately allows malicious actors to figure out valid usernames from response times,
		// allowing them to only focus on guessing passwords in brute-force attacks.
		// As a preventive measure, you may want to hash passwords even for invalid usernames.
		// However, valid usernames can be already be revealed with the signup page among other methods.
		// It will also be much more resource intensive.
		// Since protecting against this is non-trivial,
		// it is crucial your implementation is protected against brute-force attacks with login throttling etc.
		// If usernames are public, you may outright tell the user that the username is invalid.
		return {
			error: "Incorrect username or password",
			success: false,
		};
	}

	const validPassword = await new Argon2id().verify(existingUser.hashed_password, password);
	if (!validPassword) {
		return {
			error: "Incorrect username or password",
			success: false,
		};
	}

	const session = await lucia.createSession(existingUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/");
}

export async function signup(prev: any, formData: FormData): Promise<ActionResult> {
	"use server";
	const username = formData.get("username");
    console.log(username)
	// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
	// keep in mind some database (e.g. mysql) are case insensitive
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: "Invalid username",
			success: false,
		};
	}
	if (await prisma.user.findUnique({ where: { username: username } })) {
		return {
			error: "Username is already taken",
			success: false,
		};
	}
	const password = formData.get("password");
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		return {
			error: "Invalid password",
			success: false,
		};
	}

	const hashedPassword = await new Argon2id().hash(password);
	const userId = generateId(15);

	await prisma.user.create({
        data: {
            id: userId,
            username: username,
            hashed_password: hashedPassword
	    }
    });

	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/");
}

interface ActionResult {
    error: string | null;
    success: boolean | null;
}