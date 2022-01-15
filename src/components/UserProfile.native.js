class UserProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      :host {
      }
      .user {
        display: inline-flex;
        border: 1px solid #222;
        border-top: 20px solid navy;
        border-bottom: 20px solid navy;
        border-radius: 25px;
        overflow: hidden;
        padding-right: 25px;
        min-width: 350px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        position: relative;
      }

      .info {
        margin-left: 1em;
        font-family: Lato;
        font-weight: 300;
        padding: 10px;
      }

      h1 {
        font-family: Montserrat;
        font-weight: 600;
        font-size: 2em;
        margin-bottom: 0.5em;
        margin: 0;
        letter-spacing: -2px;
      }

      span.id {
        color: #777;
        writing-mode: tb;
        text-align: center;
        display: flex;
        position: absolute;
        right: 0;
        margin: .5em 0;
      }
    `;
  }

  getAPIUrl () {
    const url = new URL("https://randomuser.me/api/");
    const isValidGender = ["male", "female"].includes(this.gender);

    if (isValidGender) {
      url.searchParams.append("gender", this.gender);
    }

    return url
  }

  fetchData() {
    const url = this.getAPIUrl();

    return fetch(url)
      .then(res => res.json())
      .then(data => {
        const info = data.results[0];
        const idCard = info.id.value ? info.id.name + " " + info.id.value : "";
        const location = info.location.country + " " + info.location.city + ` (${info.nat})`;

        this.data = {
          name: info.name.title + " " + info.name.first,
          surname: info.name.last,
          idCard,
          email: info.email,
          login: info.login.username,
          password: info.login.password,
          gender: info.gender,
          age: info.dob.age,
          location,
          picture: info.picture.large,
        };
      });
  }

  connectedCallback() {
    this.gender = this.getAttribute("gender");
    this.fetchData()
      .then(() => this.render());
  }

  render() {
    const user = this.data;
    this.shadowRoot.innerHTML = /* html */`
    <style>${UserProfile.styles}</style>
    <div class="user">
      <img src="${user.picture}" alt="${user.name}" class="picture">
      <div class="info">
        <h1>${user.name} ${user.surname}</h1>
        <div><strong>Email</strong>: <span>${user.email}</span></div>
        <div><strong>Location</strong>: <span>${user.location}</span></div>
        <div><strong>Age</strong>: <span>${user.age}</span> · <strong>Gender</strong>: <span>${user.gender}</span></div>
        <div><strong>Login</strong>: <span>${user.login}</span></div>
      </div>
      <span class="id">${user.idCard}</span>
    </div>`;
  }
}

customElements.define("user-profile", UserProfile);