export function showToast(message, type = "info") {
  const colorMap = {
    success: "background-color: #d1e7dd; color: #0f5132;", // Soft green
    error: "background-color: #f8d7da; color: #842029;", // Soft red
    info: "background-color: #cfe2ff; color: #084298;", // Soft blue
  };

  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    container.style.zIndex = "1055";
    document.body.appendChild(container);
  }

  const toastId = `toast-${Date.now()}`;
  const toastHTML = `
    <div id="${toastId}"
         class="toast align-items-center border-0 shadow"
         style="${colorMap[type] || colorMap.info}"
         role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", toastHTML);

  const toastEl = document.getElementById(toastId);
  const bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });

  bsToast.show();

  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}
