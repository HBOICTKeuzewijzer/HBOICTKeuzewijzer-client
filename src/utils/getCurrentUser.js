import { User } from "@/models";

/** @type {User} */
let currentUser = null;

/** @type {Promise<User>} */
let currentUserPromise = null;

/**
 * Returns the current user info, cached after first fetch.
 * @returns {Promise<User>}
 */
export function getCurrentUser() {
    if (currentUser) return Promise.resolve(currentUser);

    if (!currentUserPromise) {
        currentUserPromise = fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    console.error(`Fetch failed: ${response.status} ${response.statusText}`);
                    currentUserPromise = null;
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (data === null) return

                currentUser = new User(data)
                return currentUser;
            })
            .catch(() => {
                currentUserPromise = null;
                return null;
            });
    }

    return currentUserPromise;
}