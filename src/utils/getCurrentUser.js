let currentUser = null;
let currentUserPromise = null;

/**
 * Returns the current user info, cached after first fetch.
 * @returns {Promise<Object>}
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
                currentUser = data;
                return data;
            })
            .catch(() => {
                currentUserPromise = null;
                return null;
            });
    }

    return currentUserPromise;
}
