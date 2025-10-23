class ContadorSimple extends HTMLElement {
    static get observedAttributes() {
        return [
            "value"
        ];
    }
    constructor(){
        super();
        console.log("[ContadorSimple] Creado (constructor)");
        const root = this.attachShadow({
            mode: "closed"
        });
        const tpl = document.getElementById("tpl-contador-simple");
        root.appendChild(tpl.content.cloneNode(true));
        this.$value = root.getElementById("value");
        this._value = 0;
        // if (!this.hasAttribute("value")) {
        //   this.setAttribute("value", "0");
        // }
        this.#render();
    }
    connectedCallback() {
        console.log("[ContadorSimple] Adjuntado al DOM (connectedCallback)");
        this.#render();
    }
    disconnectedCallback() {
        console.log("[ContadorSimple] Separado del DOM (disconnectedCallback)");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`[ContadorSimple] attributeChangedCallback \u{2192} ${name}:`, {
            oldValue,
            newValue
        });
        if (name === "value" && oldValue !== newValue) {
            this._value = this.#coerce(newValue, this._value);
            this.#render();
        }
    }
    // API pública
    get value() {
        return this._value;
    }
    set value(v) {
        this.setAttribute("value", String(this.#clamp(v)));
    }
    inc() {
        if (!this.isConnected) return;
        this.value = this._value + 1;
    }
    dec() {
        if (!this.isConnected) return;
        this.value = this._value - 1;
    }
    // Render
    #render() {
        this.$value.textContent = this._value;
    }
    // Helpers
    #coerce(raw, fallback) {
        const n = Number(raw);
        return Number.isFinite(n) ? this.#clamp(n) : this.#clamp(fallback);
    }
    #clamp(n) {
        return Math.max(0, n);
    }
}
customElements.define("contador-simple", ContadorSimple);
// ===== Lógica de la página (4 botones) =====
const mount = document.getElementById("mount");
const btnAttach = document.getElementById("btn-attach");
const btnDetach = document.getElementById("btn-detach");
const btnInc = document.getElementById("btn-inc");
const btnDec = document.getElementById("btn-dec");
// Una única instancia para ver constructor una sola vez
const comp = new ContadorSimple();
btnAttach.addEventListener("click", ()=>{
    if (!mount.contains(comp)) mount.replaceChildren(comp);
});
btnDetach.addEventListener("click", ()=>{
    if (mount.contains(comp)) mount.removeChild(comp);
});
btnInc.addEventListener("click", ()=>comp.inc());
btnDec.addEventListener("click", ()=>comp.dec());

//# sourceMappingURL=CicloVida.fd248966.js.map
