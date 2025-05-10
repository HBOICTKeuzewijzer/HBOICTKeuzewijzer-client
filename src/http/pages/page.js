import styling from './page.css?raw'
import { router } from '../router'
import { Cookie } from '@/utils'

export default function IndexPage() {
    // check if user is logged in, if so redirect to profile/studyroutes
    // else stay here and ask if they want to continue as guest or log in

    return /*html*/`
        <style>${styling}</style>
        <h1>Keuzewijzer HBO ICT</h1>
        <div class="container">
            <div class="card">
                <h2>Voor studenten</h2>
                <p>
                    Ben jij een student aan Windesheim? Log dan in om je studieroutes te beheren,
                    feedback te ontvangen van je studiebegeleider en je voortgang bij te houden.
                </p>
                <button id="login">Log in</button>
            </div>
            <div class="card">
                <h2>Voor gasten</h2>
                <p>
                    Geen Windesheim student? Verken de mogelijkheden van onze opleidingen als gast.
                    Let op: als gast kun je geen routes opslaan of feedback vragen.
                </p>
                <button id="gast" class="secondary">Gast</button>
            </div>
        </div>  
    `
}

function onClickLogin() {
    location.href = `${import.meta.env.VITE_API_URL}/auth/login?returnUrl=${location.href}`;
}

function onClickGuest() {
    router.navigate("/guest");
}

IndexPage.onPageLoaded = () => {
    if (Cookie.get('x-session') !== null) {
        router.navigate('/profile/mijn-routes');
    }

    document.querySelector("#login").addEventListener('click', onClickLogin);
    document.querySelector("#gast").addEventListener('click', onClickGuest);
}

IndexPage.onBeforePageUnloaded = () => {
    document.querySelector("#login").removeEventListener('click', onClickLogin);
    document.querySelector("#gast").removeEventListener('click', onClickGuest);
}