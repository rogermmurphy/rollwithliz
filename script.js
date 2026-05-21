/* ============================================================
   Elizabeth Murphy — site behavior
   - Mobile nav
   - Lead + referral forms: save locally AND open prefilled email
   - Admin lead viewer (export CSV / clear)
   ============================================================ */

(function () {
  "use strict";

  var CONTACT_EMAIL = "emurphy@gsquaredfunding.com";
  var STORAGE_KEY = "em_leads";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
      navToggle.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
      });
    });
  }

  /* ---------- Lead storage ---------- */
  function getLeads() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveLead(lead) {
    var leads = getLeads();
    leads.push(lead);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(leads)); }
    catch (e) { /* storage full / disabled — email still works */ }
  }

  function collect(form) {
    var data = {};
    var fd = new FormData(form);
    fd.forEach(function (value, key) {
      if (data[key] !== undefined) { data[key] += ", " + value; }
      else { data[key] = value; }
    });
    // multi-selects need explicit handling
    form.querySelectorAll("select[multiple]").forEach(function (sel) {
      var picked = Array.prototype.filter
        .call(sel.options, function (o) { return o.selected; })
        .map(function (o) { return o.value; });
      data[sel.name] = picked.join(", ");
    });
    return data;
  }

  function buildMailto(subject, data) {
    var lines = Object.keys(data).map(function (k) {
      return labelize(k) + ": " + (data[k] || "");
    });
    return "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function labelize(key) {
    return key.replace(/([A-Z])/g, " $1")
      .replace(/^./, function (c) { return c.toUpperCase(); });
  }

  function handleForm(formId, statusId, subject, type) {
    var form = document.getElementById(formId);
    var status = document.getElementById(statusId);
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // basic required validation
      var missing = false;
      form.querySelectorAll("[required]").forEach(function (el) {
        if (!el.value.trim()) { missing = true; el.style.borderColor = "#c0392b"; }
        else { el.style.borderColor = ""; }
      });
      if (missing) {
        status.textContent = "Please fill in the required fields.";
        status.className = "form-status err";
        return;
      }

      var data = collect(form);
      data.type = type;
      data.submittedAt = new Date().toLocaleString();

      saveLead(data);

      // open prefilled email
      window.location.href = buildMailto(subject, data);

      status.textContent = "Thank you! Your email app should open to send the details. I'll be in touch personally.";
      status.className = "form-status ok";
      form.reset();
    });
  }

  handleForm("leadForm", "leadStatus", "New carrier inquiry — website", "Lead");
  handleForm("referralForm", "referralStatus", "New referral — website ($100 program)", "Referral");

  /* ---------- Admin lead viewer ---------- */
  var modal = document.getElementById("adminModal");
  var adminLink = document.getElementById("adminLink");
  var adminClose = document.getElementById("adminClose");
  var leadsTable = document.getElementById("leadsTable");
  var leadCount = document.getElementById("leadCount");

  function renderLeads() {
    var leads = getLeads();
    leadCount.textContent = "(" + leads.length + ")";
    if (!leads.length) {
      leadsTable.innerHTML = "<tr><td class='leads-empty'>No leads captured in this browser yet.</td></tr>";
      return;
    }
    // union of all keys for columns
    var cols = [];
    leads.forEach(function (l) {
      Object.keys(l).forEach(function (k) { if (cols.indexOf(k) === -1) cols.push(k); });
    });
    var thead = "<tr>" + cols.map(function (c) { return "<th>" + labelize(c) + "</th>"; }).join("") + "</tr>";
    var rows = leads.map(function (l) {
      return "<tr>" + cols.map(function (c) {
        return "<td>" + escapeHtml(l[c] || "") + "</td>";
      }).join("") + "</tr>";
    }).join("");
    leadsTable.innerHTML = thead + rows;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function openModal() { renderLeads(); modal.hidden = false; }
  function closeModal() { modal.hidden = true; }

  if (adminLink) adminLink.addEventListener("click", openModal);
  if (adminClose) adminClose.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  // also reachable via #admin in the URL
  if (location.hash === "#admin") openModal();

  /* ---------- Export CSV ---------- */
  var exportBtn = document.getElementById("exportCsv");
  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      var leads = getLeads();
      if (!leads.length) { alert("No leads to export."); return; }
      var cols = [];
      leads.forEach(function (l) {
        Object.keys(l).forEach(function (k) { if (cols.indexOf(k) === -1) cols.push(k); });
      });
      var csv = [cols.map(csvCell).join(",")];
      leads.forEach(function (l) {
        csv.push(cols.map(function (c) { return csvCell(l[c] || ""); }).join(","));
      });
      var blob = new Blob([csv.join("\r\n")], { type: "text/csv" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "leads-" + new Date().toISOString().slice(0, 10) + ".csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function csvCell(v) {
    v = String(v);
    if (/[",\n\r]/.test(v)) { v = '"' + v.replace(/"/g, '""') + '"'; }
    return v;
  }

  /* ---------- Clear leads ---------- */
  var clearBtn = document.getElementById("clearLeads");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (confirm("Delete all captured leads from this browser? Export first if you want a copy.")) {
        localStorage.removeItem(STORAGE_KEY);
        renderLeads();
      }
    });
  }
})();
