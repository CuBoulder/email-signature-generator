(function () {
  const $ = (id) => document.getElementById(id);
  function val(id) {
    const el = $(id);
    return el ? (el.value ?? "") : "";
  }
  // Escape HTML
  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
  function p11(txt) {
    return txt
      ? `
<p style="font-family: Arial, Helvetica, sans-serif; font-size:11px; color:#000; margin:0; padding:0;">
        ${txt}
</p>
`
      : "";
  }
  function p12(txt) {
    return txt
      ? `
<p style="font-family: Arial, Helvetica, sans-serif; font-size:12px; color:#000; margin:0; padding:0;">
        ${txt}
</p>
`
      : "";
  }
  function buildSignatureHTML() {
    // Setting/cleaning the fields
    const style = val("sig_style") || "logo1";
    const first = escapeHtml(val("sig_first").trim());
    const last  = escapeHtml(val("sig_last").trim());
    const name  = `${first} ${last}`.trim();
    const job      = escapeHtml(val("sig_job").trim());
    const dept     = escapeHtml(val("sig_dept").trim());
    const addTitle = escapeHtml(val("sig_addtitle").trim());
    const addr1 = escapeHtml(val("sig_addr1").trim());
    const addr2 = escapeHtml(val("sig_addr2").trim());
    const main   = escapeHtml(val("sig_main").trim());
    const direct = escapeHtml(val("sig_direct").trim());
    const mobile = escapeHtml(val("sig_mobile").trim());
    const fax    = escapeHtml(val("sig_fax").trim());
    const email = escapeHtml(val("sig_email").trim());
    const website = escapeHtml(val("sig_webpath").trim());
    const pronouns = escapeHtml(val("sig_pronouns").trim());
    // Create elements
    const logo =
    // No logo
      style === "none"
        ? ""
        // Regular Logo
        : style === "logo1"
          ? '<a href="https://www.colorado.edu"><img src="https://cdn.colorado.edu/static/email-signature/logo.png" width="255" height="47" alt="University of Colorado Boulder"></a>'
          // 150 years
          : '<a href="https://www.colorado.edu/150"><img src="https://cdn.colorado.edu/static/email-signature/150-logo.png" width="360" height="90" alt="Celebrating 150 years at the University of Colorado Boulder"></a>';
    const identity = [
      name ? `
<p style="font-family: Arial, Helvetica, sans-serif; font-size:13px; font-weight:bold; color:#333; margin:0; padding:0;">
        ${name}
</p>
` : "",
      p11(job ? `<span>${job}</span>` : ""),
      p11(dept ? `<span>${dept}</span>` : ""),
      p11(addTitle)
    ].filter(Boolean).join("");
    const emailWebLine = (email || website)
      ? (
          `${email ? `<span style="color:#333; text-decoration:none;">${email}</span>` : ""}` +
          `${email && website ? ` <span style="color:CFB87C;">&bull;</span> ` : ""}` +
          `${website ? `<span style="color:#333; text-decoration:none;">${website}</span>` : ""}`
        )
      : "";
    const contact = [
      p12('<a href="http://www.colorado.edu/" style="font-weight:bold; color:#333; text-decoration:none;">University of Colorado Boulder</a>'),
      p12(addr1),
      p12(addr2),
      p12(main ? `Main Office ${main}` : ""),
      p12(direct ? `Direct ${direct}` : ""),
      p12(mobile ? `Mobile ${mobile}` : ""),
      p12(fax ? `Fax ${fax}` : ""),
      p12(emailWebLine),
      p12(pronouns ? `Pronouns: ${pronouns}` : "")
    ].filter(Boolean).join("");
    const identityBlock = identity ? `
<div style="margin-bottom:20px;">
        ${identity}
</div>
` : "";
    const contactBlock  = contact  ? `
<div style="margin-bottom:20px;">
        ${contact}
</div>
`   : "";
    return `${identityBlock}
${contactBlock}
${logo}`.trim();
}

// Put in the signature
  function render() {
    const html = buildSignatureHTML();
    $("sig_preview").innerHTML = html;
  }
// If a user clicks, select all
function selectPreviewContents() {
  const el = $("sig_preview");
  const sel = window.getSelection();
  if (!el || !sel) return;

  sel.removeAllRanges();
  const range = document.createRange();
  range.selectNodeContents(el);
  sel.addRange(range);
}

function showCopied() {
  const el = $("sig_copied");
  if (!el) return;
  el.style.display = "inline";
  clearTimeout(showCopied._t);
  showCopied._t = setTimeout(() => {
    el.style.display = "none";
  }, 1500);
}

$("sig_generate").addEventListener("click", render);

// Click the preview to select all
$("sig_preview").addEventListener("click", (e) => {
  const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
  if (tag === "a" || tag === "img") return; // avoid linked text or image!
  selectPreviewContents();
});

// Init
render();

})();