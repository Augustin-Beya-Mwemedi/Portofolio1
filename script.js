document.addEventListener('DOMContentLoaded', () => {
    // Initialiser GLightbox pour les images
    const lightbox = GLightbox({
        selector: '.glightbox',
        autoplayVideos: false
    });

    // ========== ANIMATIONS AU SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Animer les barres de compétences si la catégorie est visible
                if (entry.target.classList.contains('skill-category')) {
                    const skillBars = entry.target.querySelectorAll('.skill-level');
                    skillBars.forEach(bar => {
                        const finalWidth = bar.dataset.finalWidth || bar.getAttribute('data-level') || '0%';
                        requestAnimationFrame(() => { bar.style.width = finalWidth; });
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer tous les éléments fade-in et skill-category
    document.querySelectorAll('.fade-in, .skill-category, .stat-card').forEach(el => {
        observer.observe(el);
    });

    // Préparer les barres de compétences : stocker la largeur finale et forcer 0 au départ
    document.querySelectorAll('.skill-level').forEach(bar => {
        const attr = bar.getAttribute('data-level') || bar.dataset.level || '';
        const inline = bar.getAttribute('style') || '';
        const match = inline.match(/width\s*:\s*([^;]+)/i);
        const final = bar.dataset.final || attr || (match ? match[1].trim() : '0%');
        bar.dataset.finalWidth = final;
        bar.style.width = '0%';
    });

    // ========== COMPTEURS STATISTIQUES ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 secondes
        let current = 0;
        const increment = target / (duration / 16);

        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    };

    // Observer pour déclencher l'animation des compteurs
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    animateCounter(statNumber);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-card').forEach(card => {
        statsObserver.observe(card);
    });

    // Gestion de la navigation mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const menuList = document.querySelector('.menu-list');

    if (menuToggle && menuList) {
        menuToggle.addEventListener('click', () => {
            menuList.classList.toggle('active');
        });
    }

    // Gestion du formulaire avec FormSubmit
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = form.querySelector('[name="name"]').value;
            const email = form.querySelector('[name="email"]').value;
            const message = form.querySelector('[name="message"]').value;
            const feedback = document.getElementById('form-feedback');

            if (name && email && message) {
                // Envoyer via FormSubmit
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('message', message);

                // Afficher message de traitement
                if (feedback) {
                    feedback.textContent = 'Envoi en cours...';
                    feedback.classList.add('show');
                }

                // Envoyer l'email via FormSubmit
                fetch('https://formsubmit.co/augustin7b@gmail.com', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                        if (feedback) {
                            feedback.textContent = `Merci, ${name} — votre message a bien été envoyé. Je vous répondrai rapidement.`;
                            feedback.classList.add('show');
                        }
                        form.reset();
                        setTimeout(() => {
                            if (feedback) feedback.classList.remove('show');
                        }, 6000);
                    } else {
                        throw new Error('Erreur lors de l\'envoi');
                    }
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    if (feedback) {
                        feedback.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
                        feedback.classList.add('show');
                        setTimeout(() => feedback.classList.remove('show'), 4000);
                    }
                });
            } else {
                if (feedback) {
                    feedback.textContent = 'Veuillez remplir tous les champs du formulaire.';
                    feedback.classList.add('show');
                    setTimeout(() => feedback.classList.remove('show'), 4000);
                } else {
                    alert('Veuillez remplir tous les champs du formulaire.');
                }
            }
        });
    }

    // Défilement doux pour la navigation
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    for (const link of navLinks) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                if (menuList && menuList.classList.contains('active')) {
                    menuList.classList.remove('active');
                }
            }
        });
    }

});