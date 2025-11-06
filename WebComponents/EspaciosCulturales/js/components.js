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
    this.shadowRoot.addEventListener('search-espacios-event', (e)=> this._onSearch(e.detail));
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
      this.dispatchEvent(new CustomEvent('search-espacios-event',{detail,bubbles:true,composed:true}));
    });
  }
}
customElements.define('search-form', SearchForm);

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

/* ------------------ espacio-card ------------------ */
class EspacioCard extends HTMLElement {
  constructor(){
    super();
    this._data = null;
    this._reviewsOpen = false;
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(cloneTpl('tpl-espacio-card'));
  }
  connectedCallback(){
    this._btnReviews = this.shadowRoot.querySelector('#btn-reviews');
    if (this._btnReviews) {
      this._btnReviews.addEventListener('click', (ev)=>{
        this._reviewsOpen = !this._reviewsOpen;
        this._syncReviewsButton();
        this.reviews = this.shadowRoot.querySelector('search-valoraciones');
        this.reviews._toggleReviews({ id : String(this._data?.id), open: this._reviewsOpen });
      });
    }

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

  _syncReviewsButton(){
    // Gestiona aria + rotación flecha vía atributo en el host
    if (this._btnReviews) {
      this._btnReviews.setAttribute('aria-expanded', this._reviewsOpen ? 'true' : 'false');
    }
    if (this._reviewsOpen) {
      this.setAttribute('reviews-open', '');
    } else {
      this.removeAttribute('reviews-open');
    }
  }
}
customElements.define('espacio-card', EspacioCard);

/* ------------------ search-valoraciones (orquestador) ------------------ */
class SearchValoraciones extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(cloneTpl('tpl-search-valoraciones'));
    this.apiBase = window.API_BASE || '';
    this._all = [];
    this.hidden = true;
  }

  connectedCallback(){
    this._list = this.shadowRoot.querySelector('valoraciones-list');
    this._write = this.shadowRoot.querySelector('valoraciones-write');

    this.shadowRoot.addEventListener('review-uploaded', (ev)=> {
      const id = ev.detail?.id ?? null;
      if (id) this._toggleReviews({ id: id, open: true });
    });
  }
  async _toggleReviews({id, open}){
    this._write._id = id;
    if (open) {
      try{
        if (!id) {
          alert('No se ha seleccionado espacio.');
          return;
        }

        const qs = new URLSearchParams();
        qs.set('start', 0);
        qs.set('end', 4);

        const url = `${this.apiBase}/valoraciones/reviews/${id}?${qs.toString() ? `?${qs.toString()}` : ''}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error('network');
        const body = await res.json();
        this._all = Array.isArray(body.data) ? body.data : [];
        this.hidden = false;
        this._render();
      } catch (err) {
        console.error(err);
        this._info.textContent = 'Error al obtener datos.';
        this._list.setItems([]);
      }
    } else {
      this._all = null;
      this.hidden = true;
      this._render();
    }
  }
  _render(){
    this._list.setItems(this._all);
  }
}
customElements.define('search-valoraciones', SearchValoraciones);

/* ------------------ valoraciones-list ------------------ */
class ValoracionesList extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(cloneTpl('tpl-valoraciones-list'));
    this.items = [];
  }
  setItems(items){ this.items = items || []; this._render(); }
  appendItems(items){ this.items = [...this.items, ...(items||[])]; this._render(); }

  _render(){
    const ul = this.shadowRoot.getElementById('list');
    ul.innerHTML = '';
    (this.items || []).forEach((it)=>{
      const li = document.createElement('li');
      const card = document.createElement('valoraciones-card');
      card.data = it;
      li.appendChild(card);
      ul.appendChild(li);
    });
  }
}
customElements.define('valoraciones-list', ValoracionesList);

/* ------------------ valoraciones-card ------------------ */
class ValoracionesCard extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(cloneTpl('tpl-valoraciones-card'));
    this._data = null;
  }

  set data(d){
    this._data = d || {};
    this._render();
  }
  get data(){ return this._data; }

  _fmtDate(iso){
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(+d)) return '';
    return d.toLocaleString(undefined, {
      year:'numeric', month:'2-digit', day:'2-digit',
      hour:'2-digit', minute:'2-digit'
    });
  }

  _stars(n){
    const v = Math.max(0, Math.min(5, Number(n) || 0));
    return '★'.repeat(v) + '☆'.repeat(5 - v);
  }

  _render(){
    const d = this._data || {};
    const user = d.username ?? d.user ?? 'Anónimo';
    const rating = d.rating ?? 0;
    const text = d.review ?? d.text ?? '';
    const when = d.timestamp ?? d.createdAt ?? d.date ?? d.fecha ?? '';

    this.shadowRoot.querySelector('.user').textContent = user;
    this.shadowRoot.querySelector('.stars').textContent = this._stars(rating);
    this.shadowRoot.querySelector('.date').textContent = this._fmtDate(when);

    const textEl = this.shadowRoot.querySelector('.text');
    if (text && text !== '-') {
      textEl.textContent = text;
      textEl.hidden = false;
    } else {
      textEl.textContent = '';
      textEl.hidden = true;
    }

    this.shadowRoot.querySelector('.stars')
      .setAttribute('aria-label', `Puntuación: ${Number(rating)||0} de 5`);
  }
}
customElements.define('valoraciones-card', ValoracionesCard);

/* ------------------ valoraciones-write ------------------ */
class ValoracionesWrite extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(cloneTpl('tpl-valoraciones-write'));
    this.apiBase = window.API_BASE || '';
  }

  set id(id){ this._id = id ? String(id) : null; }
  get id(){ return this._id; }

  connectedCallback(){
    const form = this.shadowRoot.getElementById('form');
    form.addEventListener('submit', (e)=> this.#onSubmit(e));
  }

  async #onSubmit(e){
    e.preventDefault();
    if (!this._id) {
      alert('No se ha seleccionado espacio.');
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const rating = Number(fd.get('rating') || 0);
    if (!rating) {
      alert('El rating es obligatorio.');
      return;
    }

    const payload = {
      espacio_cultural_id: this._id,
      rating,
      username: (fd.get('username') || '').toString().trim() || undefined,
      review: (fd.get('review') || '').toString().trim() || undefined
    };

    try{
      const url = `${this.apiBase}/valoraciones`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      console.log(res);
      if (!res.ok) throw new Error('network');

      form.reset();

      this.dispatchEvent(new CustomEvent('review-uploaded', {
          detail: { id: this._id },
          bubbles: true,
          composed: true
      }));
    } catch (err){
      console.error(err);
      alert('No se pudo enviar la reseña. Inténtalo de nuevo.');
    }
  }
}
customElements.define('valoraciones-write', ValoracionesWrite);