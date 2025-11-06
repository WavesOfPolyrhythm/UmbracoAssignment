
const menuBtn = document.querySelector('#navToggle');
const navMenu = document.querySelector('#mobileMenu');
const closeBtn = document.querySelector('#navClose');
const backdrop = document.querySelector('#navBackdrop');

menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isExpanded));
    navMenu.classList.toggle('hidden');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
});

const close = () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.add('hidden');
    document.body.style.overflow = '';
};

closeBtn.addEventListener('click', close);
backdrop.addEventListener('click', close);


