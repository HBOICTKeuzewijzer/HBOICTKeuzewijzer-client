export default function Login(data) {
    let loginUrl = `${import.meta.env.VITE_API_URL}/auth/login`;

    if (data.query['returnUrl'] !== '') {
        loginUrl += `?returnUrl=${encodeURIComponent(data.query['returnUrl'])}`;
    }

    setTimeout(() => {
        location.href = loginUrl;
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
                Je wordt doorgestuurd naar het inlogsysteem.
            </p>
        </div>

        <style>
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    `;
}
