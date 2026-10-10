(function () {
  if (window.__brightsmileWidget) return;
  window.__brightsmileWidget = true;

  var script = document.currentScript;
  var origin = "";
  try {
    origin = (script && script.getAttribute("data-origin")) || new URL(script.src).origin;
  } catch {
    origin = window.location.origin;
  }
  origin = String(origin).replace(/\/$/, "");

  var color = (script && script.getAttribute("data-color")) || "#0f6b70";
  var label = (script && script.getAttribute("data-label")) || "Ask our AI receptionist";
  var page = window.location.pathname || "/";
  var iframe = document.createElement("iframe");
  iframe.src = origin + "/embed/chat?page=" + encodeURIComponent(page);
  iframe.title = "AI receptionist";
  iframe.setAttribute("aria-label", "AI receptionist chat");
  iframe.style.cssText =
    "position:fixed;z-index:2147483000;border:0;background:#fff;box-shadow:0 18px 50px rgba(11,34,51,.28);display:none;";

  var btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Open AI receptionist");
  btn.textContent = label;
  btn.style.cssText =
    "position:fixed;right:20px;bottom:20px;z-index:2147483001;height:52px;padding:0 18px 0 16px;border:0;border-radius:999px;background:" +
    color +
    ";color:#fff;font:600 14px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 10px 28px rgba(15,107,112,.35);";

  var open = false;
  function layout() {
    var mobile = window.innerWidth < 640;
    if (open) {
      iframe.style.display = "block";
      if (mobile) {
        iframe.style.inset = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.borderRadius = "0";
      } else {
        iframe.style.inset = "auto 20px 84px auto";
        iframe.style.width = "390px";
        iframe.style.height = "640px";
        iframe.style.maxHeight = "calc(100vh - 110px)";
        iframe.style.borderRadius = "16px";
      }
      btn.textContent = "Close";
    } else {
      iframe.style.display = "none";
      btn.textContent = label;
    }
  }

  btn.addEventListener("click", function () {
    open = !open;
    layout();
  });
  window.addEventListener("resize", layout);
  document.body.appendChild(iframe);
  document.body.appendChild(btn);
  layout();
})();
