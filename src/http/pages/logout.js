import { Cookie } from "@/utils";

export default function Logout() {
    let logoutUrl = `${import.meta.env.VITE_API_URL}/auth/logout?returnUrl=${location.origin}`;

    Cookie.set('x-session', 'null', { expires: new Date(0) })

    setTimeout(() => {
        location.href = logoutUrl;
    }, 100);

    return /*html*/`
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
            font-family: sans-serif;
            text-align: center;
        ">
            <div class="spinner" style="
                width: 48px;
                height: 48px;
                border: 6px solid #ccc;
                border-top-color: #007BFF;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1.5rem;
            "></div>
            <h1 style="font-size: 1.5rem; margin: 0 0 0.5rem;">Even geduld...</h1>
            <p style="font-size: 1rem; color: #555;">
                Je wordt uitgelogd.
            </p>
        </div>

        <style>
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    `;
}