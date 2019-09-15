document.querySelectorAll('.transition').forEach(e => e.addEventListener('click', function(event) 
{
    event.preventDefault();
    document.getElementById('main').classList.add('animate-out');
    setTimeout(() => {
        window.location = this.href;
    }, 500);
}));