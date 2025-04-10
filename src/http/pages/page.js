export default function HomePage() {
    return /*html*/ `
        <div class="container">
            <form style="display: flex; gap: 12px; flex-direction: column; margin: auto;">
                <p>Selecteer jouw startjaar:</p>
                <select id="yearSelect" required style="width: 250px; height: 40px;">
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                </select>

                <button onClick='' style="width: 250px; height: 28px;">Verder</button>
            </div>
        </div>
    `
}
