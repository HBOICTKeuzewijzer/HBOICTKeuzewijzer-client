let currentUser = null;
let currentUserPromise = null;

/**
 * Returns the current user info, cached after first fetch.
 * @returns {Promise<Object>}
 */
export async function getCurrentUser() {
    if (currentUser) return currentUser;

    if (!currentUserPromise) {
        currentUserPromise = (async () => {
            try {
                const response = await fetch('https://localhost:8081/auth/me', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    console.error(`Fetch failed: ${response.status} ${response.statusText}`);
                    currentUserPromise = null;
                    return null;
                }

                const data = await response.json();
                currentUser = data;
                return data;

            } catch (err) {
                console.error('Fetch error:', err);
                currentUserPromise = null;
                throw err;
            }
        })();
    }

    return currentUserPromise;
}
