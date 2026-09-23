var ECO_REPORT_KEY = 'eco_reports';

var ECO_NIGERIA_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa',
  'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
  'Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe',
  'Zamfara','FCT Abuja'
];

var ECO_SAMPLE_REPORTS = [
  {id:'EC-001', issue:'Illegal dumping near school compound', loc:'Asaba, Delta', state:'Delta', lga:'Oshimili South', address:'Near school compound, Asaba', status:'Ongoing', agent:'Agent Chinedu Obi', type:'Government Agency', date:'Jun 3, 2026', time:'9:30 AM', note:'Your agent is currently conducting a site inspection.', priority:'High', citizen:'Chidi Okeke', userEmail:'citizen@demo.com', media:[
    {url:'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80', kind:'before', caption:'Large illegal dump before cleanup'},
    {url:'https://images.unsplash.com/photo-1542587220-0cd71d4a7f3f?auto=format&fit=crop&w=1200&q=80', kind:'after', caption:'Site after cleanup: area cleared and swept'}
  ]},
  {id:'EC-002', issue:'Blocked drainage causing flooding', loc:'Warri, Delta', state:'Delta', lga:'Warri South', address:'By the main drainage, Warri', status:'Waiting for Approval', agent:'Agent Amina Bello', type:'Private Contractor', date:'Jun 7, 2026', time:'2:15 PM', note:'Awaiting approval from the supervising officer. Usually 24-48 hrs.', priority:'Medium', citizen:'Chidi Okeke', userEmail:'citizen@demo.com'},
  {id:'EC-003', issue:'Waste pile at estate gate', loc:'Ibusa, Delta', state:'Delta', lga:'Oshimili North', address:'Estate gate, Ibusa', status:'Assigned', agent:'Agent Musa Ibrahim', type:'Government Agency', date:'Jun 8, 2026', time:'11:00 AM', note:'Agent has been assigned and will contact you within 24 hours.', priority:'Medium', citizen:'Chidi Okeke', userEmail:'citizen@demo.com'},
  {id:'EC-004', issue:'Industrial waste discharge into stream', loc:'Enugu, Enugu', state:'Enugu', lga:'Enugu North', address:'Community stream, Enugu', status:'Resolved', agent:'Agent Ngozi Eze', type:'Private Contractor', date:'Jun 1, 2026', time:'4:45 PM', note:'This report has been fully resolved and closed. Thank you!', priority:'High', citizen:'Ngozi Eze', userEmail:'sample@demo.com'},
  {id:'EC-005', issue:'Open waste burning near residential area', loc:'Lagos Island, Lagos', state:'Lagos', lga:'Lagos Island', address:'Residential close, Lagos Island', status:'Ongoing', agent:'Agent Taiwo Adeyemi', type:'Government Agency', date:'Jun 9, 2026', time:'8:10 AM', note:'Field team dispatched. Cleanup in progress.', priority:'High', citizen:'Taiwo Adeyemi', userEmail:'sample@demo.com', media:[
    {url:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', kind:'before', caption:'Open burning and heavy smoke before intervention'},
    {url:'https://images.unsplash.com/photo-1526403224741-97a1a1a4b4d9?auto=format&fit=crop&w=1200&q=80', kind:'after', caption:'After: debris removed and safe disposal arranged'}
  ]}
];

function ecoReadReports() {
  try {
    var raw = localStorage.getItem(ECO_REPORT_KEY);
    var parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(function(report) {
      return report && typeof report === 'object' && typeof report.id === 'string' && report.id.trim();
    }) : [];
  } catch (e) {
    return [];
  }
}

function ecoSaveReports(reports) {
  localStorage.setItem(ECO_REPORT_KEY, JSON.stringify(reports));
}

function ecoAllReports() {
  var saved = ecoReadReports();
  var map = {};
  saved.concat(ecoPersonalMockReports()).concat(ECO_SAMPLE_REPORTS).forEach(function(r) {
    map[r.id] = r;
  });
  return Object.keys(map).map(function(id) { return map[id]; }).sort(function(a, b) {
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
}

function ecoAddReport(report) {
  var reports = ecoReadReports();
  reports.unshift(report);
  ecoSaveReports(reports);
}

function ecoFindReport(id) {
  var wanted = (id || '').toUpperCase();
  return ecoAllReports().find(function(r) { return r.id.toUpperCase() === wanted; });
}

function ecoMyReports() {
  var email = localStorage.getItem('eco_email') || 'citizen@demo.com';
  var saved = ecoReadReports().filter(function(r) {
    return r.userEmail === email || (!r.userEmail && email === 'citizen@demo.com');
  });
  var ownedSamples = email === 'citizen@demo.com'
    ? ECO_SAMPLE_REPORTS.filter(function(r) { return r.userEmail === email; })
    : ecoPersonalMockReports();
  return saved.concat(ownedSamples).sort(function(a, b) {
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
}

function ecoPersonalMockReports() {
  var email = localStorage.getItem('eco_email') || '';
  if (!email || email === 'citizen@demo.com') return [];
  var name = localStorage.getItem('eco_user_name') || email.split('@')[0];
  var state = localStorage.getItem('eco_state') || 'Lagos';
  var now = new Date();
  var today = now.toLocaleDateString('en-NG', {year:'numeric',month:'short',day:'numeric'});
  return [
    {id:'EC-MY-001', issue:'Community waste report awaiting agency review', loc:state + ' Central, ' + state, state:state, lga:state + ' Central', address:'Community area, ' + state, status:'Waiting for Approval', agent:'Unassigned', type:'Pending Assignment', date:today, time:ecoFormatClock(now), note:'This mock report belongs to the registered profile and uses the current account email.', priority:'Medium', citizen:name, userEmail:email, createdAt:now.getTime() - 60000},
    {id:'EC-MY-002', issue:'Drainage cleanup activity in progress', loc:state + ' Municipal, ' + state, state:state, lga:state + ' Municipal', address:'Main drainage corridor, ' + state, status:'Ongoing', agent:'Agent Response Team', type:'Government Agency', date:today, time:ecoFormatClock(now), note:'A response team has started work and updates will be posted on this tracking ID.', priority:'High', citizen:name, userEmail:email, createdAt:now.getTime() - 120000}
  ];
}

function ecoInitials(name) {
  var clean = (name || '').trim();
  if (!clean) return 'EC';
  return clean.split(/\s+/).map(function(w) { return w[0] || ''; }).slice(0, 2).join('').toUpperCase() || 'EC';
}

function ecoGreeting() {
  var hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function ecoStatusClass(status, prefix) {
  if (status === 'Waiting for Approval' || status === 'Pending') return prefix + 'amber';
  if (status === 'Ongoing') return prefix + 'blue';
  return prefix + 'green';
}

function ecoDisplayName() {
  return localStorage.getItem('eco_user_name') ||
    localStorage.getItem('eco_agency_name') ||
    'EcoClean User';
}

function ecoFormatClock(date) {
  return date.toLocaleTimeString('en-NG', { hour:'numeric', minute:'2-digit' });
}

function ecoFillSelect(selectId, items, placeholder) {
  var select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = '';
  if (placeholder) {
    var placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.hidden = true;
    placeholderOption.textContent = placeholder;
    select.appendChild(placeholderOption);
  }
  items.forEach(function(item) {
    var opt = document.createElement('option');
    opt.value = item;
    opt.textContent = item;
    select.appendChild(opt);
  });
}

function ecoFillStateSelects() {
  var selects = document.querySelectorAll('.eco-state-select');
  selects.forEach(function(select) {
    var label = select.dataset.placeholder || 'Select State';
    ecoFillSelect(select.id, ECO_NIGERIA_STATES, label);
  });
}

function ecoApplySharedUI() {
  var style = document.createElement('style');
  style.textContent =
    '.nav-center{gap:18px!important;}' +
    '.nav-a,.nav-link{text-transform:uppercase;letter-spacing:0.08em;font-weight:800!important;}' +
    '.nav-user{display:flex;align-items:center;justify-content:flex-end;gap:10px;text-decoration:none;color:inherit;}' +
    '.nav-user-meta{text-align:right;line-height:1.15;min-width:0;}' +
    '.nav-user-name{font-size:12px;font-weight:800;color:inherit;white-space:nowrap;max-width:150px;overflow:hidden;text-overflow:ellipsis;}' +
    '.nav-user-label{font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.42);}' +
    '.eco-site-footer{background:#011208;color:#fff;padding:46px 28px 24px;border-top:1px solid rgba(255,255,255,0.08);}' +
    '.eco-site-footer a{color:rgba(255,255,255,0.54);text-decoration:none;font-size:13px;}' +
    '.eco-site-footer a:hover{color:#34d399;}' +
    '.eco-footer-grid{max-width:980px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:24px;}' +
    '@media(max-width:700px){.nav-center{gap:8px!important;}.eco-footer-grid{grid-template-columns:1fr 1fr;}.eco-site-footer{padding:34px 18px 22px;}}';
  document.head.appendChild(style);

  var initials = ecoInitials(ecoDisplayName());
  ['navAvatar','avatarEl','topbarAvatar','welcomeAvatar'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el && !el.textContent.trim()) el.textContent = initials;
  });
  ['navName','topbarName'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = ecoDisplayName();
  });
  var email = localStorage.getItem('eco_email') || '';
  ['navEmail','topbarEmail'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = email;
  });
  document.querySelectorAll('[data-eco-full-name]').forEach(function(el) {
    el.textContent = ecoDisplayName();
  });

  if (!document.querySelector('footer')) {
    var footer = document.createElement('footer');
    footer.className = 'eco-site-footer';
    footer.innerHTML =
      '<div class="eco-footer-grid">' +
        '<div><div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;"><div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px;">EC</div><strong style="font-size:17px;">EcoClean <span style="color:#34d399;">Nigeria</span></strong></div><p style="font-size:13px;line-height:1.7;color:rgba(255,255,255,0.46);max-width:360px;">Report waste issues, track every case, and connect with verified environmental responders across Nigeria.</p></div>' +
        '<div><h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#6ee7b7;margin:0 0 12px;">Platform</h3><p><a href="Index.html">Home</a></p><p><a href="report.html">Report</a></p><p><a href="track.html">Track</a></p></div>' +
        '<div><h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#6ee7b7;margin:0 0 12px;">Account</h3><p><a href="signup.html">Sign In</a></p><p><a href="profile.html">Profile</a></p><p><a href="agencies.html">Agency Portal</a></p></div>' +
        '<div><h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#6ee7b7;margin:0 0 12px;">Support</h3><p><a href="track.html">Find Agencies</a></p><p><a href="report.html">Submit a Case</a></p><p><a href="profile.html">Notifications</a></p></div>' +
      '</div>' +
      '<div style="max-width:980px;margin:28px auto 0;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;"><p style="font-size:11px;color:rgba(255,255,255,0.28);margin:0;">2026 EcoClean Nigeria. All rights reserved.</p><p style="font-size:11px;color:rgba(255,255,255,0.28);margin:0;">Built for a cleaner Nigeria.</p></div>';
    document.body.appendChild(footer);
  }
}

document.addEventListener('DOMContentLoaded', ecoFillStateSelects);
