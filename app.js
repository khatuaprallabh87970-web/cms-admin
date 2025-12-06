// cms-admin/app.js
const { useState, useEffect } = React;

const API_URL = 'http://localhost:5000';

function Login({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      onLogin(data.token);
    } catch (err) {
      setError('Login failed. Check credentials.');
    }
  }

  return (
    React.createElement("div", { className: "flex items-center justify-center h-screen" },
      React.createElement("form", { onSubmit: handleSubmit, className: "bg-white p-6 rounded shadow w-80" },
        React.createElement("h2", { className: "text-xl mb-4 font-semibold" }, "Admin Login"),
        React.createElement("input", {
          className: "border p-2 w-full mb-2",
          placeholder: "Username",
          value: username,
          onChange: e => setUsername(e.target.value)
        }),
        React.createElement("input", {
          className: "border p-2 w-full mb-2",
          placeholder: "Password",
          type: "password",
          value: password,
          onChange: e => setPassword(e.target.value)
        }),
        error && React.createElement("p", { className: "text-red-500 text-sm mb-2" }, error),
        React.createElement("button", { className: "bg-blue-600 text-white px-4 py-2 w-full" }, "Login")
      )
    )
  );
}

function Sidebar({ current, setCurrent, onLogout }) {
  const items = ['About', 'Skills', 'Projects', 'Blogs', 'Experience', 'Testimonials', 'Services', 'Messages', 'Media'];
  return (
    React.createElement("div", { className: "w-52 bg-gray-800 text-white p-4 min-h-screen" },
      React.createElement("h2", { className: "text-lg font-bold mb-4" }, "CMS Admin"),
      items.map(item =>
        React.createElement("button", {
          key: item,
          onClick: () => setCurrent(item),
          className: "block w-full text-left mb-2 px-2 py-1 rounded " + (current === item ? "bg-gray-600" : "hover:bg-gray-700")
        }, item)
      ),
      React.createElement("button", {
        onClick: onLogout,
        className: "mt-4 bg-red-500 w-full py-1 rounded"
      }, "Logout")
    )
  );
}

function AboutPage({ token }) {
  const [about, setAbout] = useState({ name: '', title: '', description: '' });

  useEffect(() => {
    fetch(API_URL + '/content/about')
      .then(r => r.json())
      .then(setAbout);
  }, []);

  async function save() {
    await fetch(API_URL + '/content/about', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(about)
    });
    alert('Saved');
  }

  return (
    React.createElement("div", null,
      React.createElement("h2", { className: "text-xl mb-4" }, "About"),
      React.createElement("input", {
        className: "border p-2 w-full mb-2",
        placeholder: "Name",
        value: about.name || '',
        onChange: e => setAbout({ ...about, name: e.target.value })
      }),
      React.createElement("input", {
        className: "border p-2 w-full mb-2",
        placeholder: "Title",
        value: about.title || '',
        onChange: e => setAbout({ ...about, title: e.target.value })
      }),
      React.createElement("textarea", {
        className: "border p-2 w-full mb-2",
        placeholder: "Description",
        value: about.description || '',
        onChange: e => setAbout({ ...about, description: e.target.value })
      }),
      React.createElement("button", { onClick: save, className: "bg-blue-600 text-white px-4 py-2" }, "Save")
    )
  );
}

function SimpleListPage({ token, path, title }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });

  async function load() {
    const res = await fetch(API_URL + '/content/' + path);
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => { load(); }, [path]);

  async function add() {
    await fetch(API_URL + '/content/' + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(form)
    });
    setForm({ title: '', description: '' });
    load();
  }

  async function remove(id) {
    await fetch(API_URL + '/content/' + path + '/' + id, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token }
    });
    load();
  }

  return (
    React.createElement("div", null,
      React.createElement("h2", { className: "text-xl mb-4" }, title),
      React.createElement("div", { className: "mb-4" },
        React.createElement("input", {
          className: "border p-2 w-full mb-2",
          placeholder: "Title / Name",
          value: form.title,
          onChange: e => setForm({ ...form, title: e.target.value })
        }),
        React.createElement("textarea", {
          className: "border p-2 w-full mb-2",
          placeholder: "Description / Details",
          value: form.description,
          onChange: e => setForm({ ...form, description: e.target.value })
        }),
        React.createElement("button", { onClick: add, className: "bg-blue-600 text-white px-4 py-2" }, "Add")
      ),
      React.createElement("ul", null,
        items.map(item =>
          React.createElement("li", { key: item.id, className: "border p-2 mb-2" },
            React.createElement("div", { className: "font-semibold" }, item.title || item.name),
            React.createElement("p", null, item.description),
            React.createElement("button", {
              onClick: () => remove(item.id),
              className: "mt-1 text-sm text-red-600"
            }, "Delete")
          )
        )
      )
    )
  );
}

function SkillsPage({ token }) {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: '', level: '' });

  async function load() {
    const res = await fetch(API_URL + '/content/skills');
    setSkills(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function add() {
    await fetch(API_URL + '/content/skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(form)
    });
    setForm({ name: '', level: '' });
    load();
  }

  async function remove(id) {
    await fetch(API_URL + '/content/skills/' + id, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token }
    });
    load();
  }

  return (
    React.createElement("div", null,
      React.createElement("h2", { className: "text-xl mb-4" }, "Skills"),
      React.createElement("div", { className: "mb-4" },
        React.createElement("input", {
          className: "border p-2 w-full mb-2",
          placeholder: "Skill name",
          value: form.name,
          onChange: e => setForm({ ...form, name: e.target.value })
        }),
        React.createElement("input", {
          className: "border p-2 w-full mb-2",
          placeholder: "Level (Beginner/Intermediate/Advanced)",
          value: form.level,
          onChange: e => setForm({ ...form, level: e.target.value })
        }),
        React.createElement("button", { onClick: add, className: "bg-blue-600 text-white px-4 py-2" }, "Add")
      ),
      React.createElement("ul", null,
        skills.map(s =>
          React.createElement("li", { key: s.id, className: "border p-2 mb-2" },
            s.name, " - ", s.level,
            React.createElement("button", {
              onClick: () => remove(s.id),
              className: "ml-2 text-sm text-red-600"
            }, "Delete")
          )
        )
      )
    )
  );
}

function MessagesPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(API_URL + '/contact/messages')
      .then(r => r.json())
      .then(setMessages);
  }, []);

  return (
    React.createElement("div", null,
      React.createElement("h2", { className: "text-xl mb-4" }, "Messages"),
      messages.length === 0 && React.createElement("p", null, "No messages yet."),
      messages.map(m =>
        React.createElement("div", { key: m.id, className: "border p-2 mb-2" },
          React.createElement("div", { className: "font-semibold" }, m.name, " (", m.email, ")"),
          React.createElement("p", null, m.message),
          React.createElement("p", { className: "text-xs text-gray-500" }, m.createdAt)
        )
      )
    )
  );
}

function MediaPage({ token }) {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);

  async function load() {
    const res = await fetch(API_URL + '/upload/media');
    setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function upload(e) {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    await fetch(API_URL + '/upload/image', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
      body: formData
    });
    setFile(null);
    load();
  }

  return (
    React.createElement("div", null,
      React.createElement("h2", { className: "text-xl mb-4" }, "Media"),
      React.createElement("form", { onSubmit: upload, className: "mb-4" },
        React.createElement("input", {
          type: "file",
          onChange: e => setFile(e.target.files[0]),
          className: "mb-2"
        }),
        React.createElement("button", { className: "bg-blue-600 text-white px-4 py-2" }, "Upload")
      ),
      React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4" },
        items.map(i =>
          React.createElement("div", { key: i.id, className: "border p-2" },
            React.createElement("p", { className: "text-xs break-all" }, i.filename),
            React.createElement("img", { src: API_URL + i.path, className: "mt-1 max-h-32 object-cover" })
          )
        )
      )
    )
  );
}

function App() {
  const [token, setToken] = useState('');
  const [current, setCurrent] = useState('About');

  if (!token) {
    return React.createElement(Login, { onLogin: setToken });
  }

  let content = null;
  if (current === 'About') content = React.createElement(AboutPage, { token });
  else if (current === 'Skills') content = React.createElement(SkillsPage, { token });
  else if (current === 'Projects') content = React.createElement(SimpleListPage, { token, path: "projects", title: "Projects" });
  else if (current === 'Blogs') content = React.createElement(SimpleListPage, { token, path: "blogs", title: "Blogs" });
  else if (current === 'Experience') content = React.createElement(SimpleListPage, { token, path: "experience", title: "Experience" });
  else if (current === 'Testimonials') content = React.createElement(SimpleListPage, { token, path: "testimonials", title: "Testimonials" });
  else if (current === 'Services') content = React.createElement(SimpleListPage, { token, path: "services", title: "Services" });
  else if (current === 'Messages') content = React.createElement(MessagesPage, null);
  else if (current === 'Media') content = React.createElement(MediaPage, { token });

  return (
    React.createElement("div", { className: "flex" },
      React.createElement(Sidebar, { current, setCurrent, onLogout: () => setToken('') }),
      React.createElement("div", { className: "flex-1 p-4" }, content)
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(App)
);
