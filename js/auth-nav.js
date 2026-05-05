/**
 * auth-nav.js
 * Include this on every page.
 * - If logged in: icon links to profile.html + shows "Hello! {first_name}"
 * - If not logged in: icon links to login.html + shows "Login" link
 */
(function () {
  const raw = localStorage.getItem('feane_user');
  const link = document.getElementById('userIconLink');
  const greeting = document.getElementById('userGreeting');

  if (raw) {
    const user = JSON.parse(raw);
    if (link) {
      link.href = 'profile.html';
      link.style.color = '#ffbe33';
      link.title = 'My Profile';
    }
    if (greeting) {
      greeting.innerHTML =
        '<a href="profile.html" style="color:#ffbe33;font-weight:600;text-decoration:none;">' +
        'Hello! ' + user.first_name +
        '</a>';
    }
  } else {
    if (link) {
      link.href = 'login.html';
      link.style.color = '#ffffff';
    }
    if (greeting) {
      greeting.innerHTML =
        '<a href="login.html" style="color:#ffffff;font-weight:600;text-decoration:none;">Login</a>';
    }
  }
})();