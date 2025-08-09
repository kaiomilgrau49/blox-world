
const ADMIN_NAME = 'admin';
const ADMIN_PASS = '******************************************************************kaio';
function md5(str){ let h=0; for(let i=0;i<str.length;i++){h=(h<<5)-h+str.charCodeAt(i);h=h&h;} return (h>>>0).toString(16); }
function getFingerprint(){ let f = localStorage.getItem('blox_fingerprint'); if(!f){ f = 'fp_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,9); localStorage.setItem('blox_fingerprint', f);} return f; }
function ensureAdmin(){ if(!localStorage.getItem('blox_user_' + ADMIN_NAME)){ const admin = {name: ADMIN_NAME, email: 'admin@blox.world', password: ADMIN_PASS, role: 'admin'}; localStorage.setItem('blox_user_' + ADMIN_NAME, JSON.stringify(admin)); localStorage.setItem('tokens_' + ADMIN_NAME, 'infinite'); localStorage.setItem('fingerprint_' + ADMIN_NAME, getFingerprint()); } }
function isBannedFingerprint(fp){ try{ const arr = JSON.parse(localStorage.getItem('blox_banned') || '[]'); return arr.indexOf(fp) !== -1; }catch(e){ return false; } }
function banFingerprint(fp){ try{ const arr = JSON.parse(localStorage.getItem('blox_banned') || '[]'); if(arr.indexOf(fp) === -1){ arr.push(fp); localStorage.setItem('blox_banned', JSON.stringify(arr)); } }catch(e){ localStorage.setItem('blox_banned', JSON.stringify([fp])); } }
function unbanFingerprint(fp){ try{ let arr = JSON.parse(localStorage.getItem('blox_banned') || '[]'); arr = arr.filter(x=>x!==fp); localStorage.setItem('blox_banned', JSON.stringify(arr)); }catch(e){} }
function getTokensOf(user){ const v = localStorage.getItem('tokens_' + user); if(v === null) return 0; if(v === 'infinite') return Infinity; const n = parseInt(v); return isNaN(n) ? 0 : n; }
function setTokensOf(user, amount){ if(amount === Infinity) localStorage.setItem('tokens_' + user, 'infinite'); else localStorage.setItem('tokens_' + user, String(amount)); updateUserArea(); }
function updateUserArea(){ const area = document.getElementById('userArea'); if(!area) return; const user = sessionStorage.getItem('blox_user'); if(user){ const tokens = getTokensOf(user); const tokensText = tokens === Infinity ? '∞' : tokens; area.innerHTML = `<img src="https://www.gravatar.com/avatar/${md5(user)}?d=identicon&s=32" style="vertical-align:middle;border-radius:4px;margin-right:6px"><span style="color:white;font-weight:bold">${user}</span><span style="margin-left:12px;color:#ffd200;font-weight:bold">${tokensText} 🪙</span><a href="#" style="color:#ffd200;margin-left:8px" onclick="logout()">Sair</a>`; } else { area.innerHTML = '<a href="login.html" style="color:white">Login</a> / <a href="signup.html" style="color:white">Sign Up</a>'; } }
(function(){ ensureAdmin(); const fp = getFingerprint(); if(isBannedFingerprint(fp) && window.location.pathname.indexOf('ban.html') === -1){ window.location.href = 'ban.html'; } })();
function logout(){ sessionStorage.removeItem('blox_user'); location.href = 'index.html'; }
function currentUserObj(){ const user = sessionStorage.getItem('blox_user'); if(!user) return null; try{ return JSON.parse(localStorage.getItem('blox_user_' + user)); }catch(e){ return null; } }
window.adminActions = {
  banUserByName: function(username){
    const fp = localStorage.getItem('fingerprint_' + username);
    if(fp){ banFingerprint(fp); localStorage.removeItem('blox_user_' + username); localStorage.removeItem('tokens_' + username); localStorage.removeItem('fingerprint_' + username); alert(username + ' banido (por fingerprint).'); location.reload(); return; }
    let bannedNames = JSON.parse(localStorage.getItem('blox_banned_names')||'[]'); if(bannedNames.indexOf(username)===-1){ bannedNames.push(username); localStorage.setItem('blox_banned_names', JSON.stringify(bannedNames)); }
    localStorage.removeItem('blox_user_' + username); localStorage.removeItem('tokens_' + username);
    alert(username + ' banido (por nome).');
    location.reload();
  },
  unbanName: function(username){
    let bannedNames = JSON.parse(localStorage.getItem('blox_banned_names')||'[]'); bannedNames = bannedNames.filter(x=>x!==username); localStorage.setItem('blox_banned_names', JSON.stringify(bannedNames)); alert(username + ' desbanido (nome).'); location.reload();
  },
  setTokens: function(username, amount){
    if(username === ADMIN_NAME) { alert('Não é possível alterar tokens do admin.'); return; }
    setTokensOf(username, amount);
    alert('Tokens atualizados.');
  },
  addCatalogItem: function(item){
    const arr = JSON.parse(localStorage.getItem('blox_catalog')||'[]'); arr.push(item); localStorage.setItem('blox_catalog', JSON.stringify(arr)); alert('Item adicionado.'); location.reload();
  },
  removeCatalogItem: function(idx){
    const arr = JSON.parse(localStorage.getItem('blox_catalog')||'[]'); arr.splice(idx,1); localStorage.setItem('blox_catalog', JSON.stringify(arr)); alert('Item removido.'); location.reload();
  }
};
window.getFingerprint = getFingerprint;
window.getTokensOf = getTokensOf;
window.setTokensOf = setTokensOf;
window.isBannedFingerprint = isBannedFingerprint;
window.banFingerprint = banFingerprint;
window.unbanFingerprint = unbanFingerprint;
window.currentUserObj = currentUserObj;
window.updateUserArea = updateUserArea;
window.ensureAdmin = ensureAdmin;
