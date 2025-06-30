const loaderModal = document.getElementById('loader-container');
function hideLoader() {
    // Add the 'fade-out' class to trigger the CSS opacity transition
    loaderModal.classList.add('fade-out');
    loaderModal.addEventListener('transitionend', function handler() {
        loaderModal.style.display = 'none';
        loaderModal.removeEventListener('transitionend', handler);
        document.body.style.overflow = 'auto';
    });
}

window.onload = function() {
    setTimeout(hideLoader, 1150);
    document.body.style.overflow = 'hidden';
};