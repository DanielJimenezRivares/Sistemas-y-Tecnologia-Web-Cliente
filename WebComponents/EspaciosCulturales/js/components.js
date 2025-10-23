const cloneTpl = (id) => {
  const t = document.getElementById(id);
  if (!t) throw new Error(`Template no encontrado: #${id}`);
  return t.content.cloneNode(true);
};
const escapeHtml = (s) => (s == null ? "" : String(s));

/* ------------------ app-header ------------------ */
class AppHeader extends HTMLElement {
  static get observedAttributes(){ return ['title']; }
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(cloneTpl('tpl-app-header'));
  }
  connectedCallback(){ this._render(); }
  attributeChangedCallback(){ this._render(); }
  _render(){
    const h1 = this.shadowRoot.querySelector('h1');
    h1.textContent = this.getAttribute('title') || 'Espacios Culturales';
  }
}
customElements.define('app-header', AppHeader);

/* ------------------ app-footer ------------------ */
class AppFooter extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(cloneTpl('tpl-app-footer'));
  }
  connectedCallback(){
    const y = this.shadowRoot.querySelector('.y');
    if (y) y.textContent = String(new Date().getFullYear());
  }
}
customElements.define('app-footer', AppFooter);

/* ------------------ app-layout ------------------ */
class AppLayout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(cloneTpl('tpl-app-layout'));
  }
}
customElements.define('app-layout', AppLayout);

/* ------------------ espacio-card ------------------ */
class EspacioCard extends HTMLElement {
  constructor(){
    super();
    this._data = null;
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(cloneTpl('tpl-espacio-card'));
  }
  connectedCallback(){
    if (this._data) this._render();
  }
  set data(obj){ this._data = obj || {}; this._render(); }
  get data(){ return this._data; }

  _normalize(value){
    return value === '_U' ? '-' : (value || '-');
  }

  _render(){
    const d = this._data || {};
    const nombre = this._normalize(d.nombre);
    const direccion = this._normalize(d.direccion);
    const horario = this._normalize(d.horario);
    const telefono = this._normalize(d.telefono);
    const web = this._normalize(d.web);

    this.shadowRoot.querySelector('#title').textContent = escapeHtml(nombre);
    this.shadowRoot.querySelector('#dir').textContent = escapeHtml(direccion);

    const typesWrap = this.shadowRoot.querySelector('.types-wrap');
    typesWrap.innerHTML = '';
    if (Array.isArray(d.tipos) && d.tipos.length){
      const span = document.createElement('div');
      span.className = 'types';
      span.textContent = d.tipos.join(', ');
      typesWrap.appendChild(span);
    }

    this.shadowRoot.querySelector('#horario').textContent = `Horario: ${escapeHtml(horario)}`;
    this.shadowRoot.querySelector('#tel').textContent = `Tel: ${escapeHtml(telefono)}`;

    const webEl = this.shadowRoot.querySelector('#web');
    webEl.innerHTML = '';
    if (web !== '-' && web !== '_U'){
      const a = document.createElement('a');
      a.className = 'link';
      a.target = '_blank';
      a.rel = 'noopener';
      a.href = escapeHtml(web);
      a.textContent = 'Visitar web';
      webEl.appendChild(a);
    } else {
      webEl.textContent = 'Web: -';
    }
  }
}
customElements.define('espacio-card', EspacioCard);

/* ------------------ search-form ------------------ */
class SearchForm extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(cloneTpl('tpl-search-form'));
  }
  connectedCallback(){
    const form = this.shadowRoot.querySelector('form');
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(form);
      const q = (fd.get('q') || '').toString().trim();
      const tipo = (fd.get('tipo') || '').toString();
      const detail = { q, tipo };
      this.dispatchEvent(new CustomEvent('search',{detail,bubbles:true,composed:true}));
    });
  }
}
customElements.define('search-form', SearchForm);

/* ------------------ search-espacios (orquestador) ------------------ */
class SearchEspacios extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(cloneTpl('tpl-search-espacios'));
    this.apiBase = window.API_BASE || '';
    this._all = [];
  }
  connectedCallback(){
    this.shadowRoot.addEventListener('search', (e)=> this._onSearch(e.detail));
    this._list = this.shadowRoot.querySelector('espacios-list');
    this._info = this.shadowRoot.getElementById('info');
  }
  async _onSearch({q, tipo}){
    try{
      const qs = new URLSearchParams();
      if (tipo) qs.set('tipo', tipo);
      if (q) qs.set('q', q);
      qs.set('start', 0);
      qs.set('end', 4);

      const url = `${this.apiBase}/espacios${qs.toString() ? `?${qs.toString()}` : ''}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error('network');
      const body = await res.json();
      this._all = Array.isArray(body.data) ? body.data : [];
      this._render();
    } catch (err) {
      console.error(err);
      this._info.textContent = 'Error al obtener datos.';
      this._list.setItems([]);
    }
  }
  _render(){
    this._list.setItems(this._all);
    this._info.textContent = `Mostrando ${this._all.length} resultados`;
  }
}
customElements.define('search-espacios', SearchEspacios);

/* ------------------ espacios-list ------------------ */
class EspaciosList extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(cloneTpl('tpl-espacios-list'));
    this.items = [];
  }
  setItems(items){ this.items = items || []; this._render(); }
  appendItems(items){ this.items = [...this.items, ...(items||[])]; this._render(); }

  _render(){
    const ul = this.shadowRoot.getElementById('list');
    ul.innerHTML = '';
    (this.items || []).forEach((it)=>{
      const li = document.createElement('li');
      const card = document.createElement('espacio-card');
      card.data = it;
      li.appendChild(card);
      ul.appendChild(li);
    });
  }
}
customElements.define('espacios-list', EspaciosList);