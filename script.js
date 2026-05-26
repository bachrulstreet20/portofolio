document.addEventListener('DOMContentLoaded', function() {
    
    // ===== LOADER =====
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hide'), 600);
    });

    // ===== NAVIGATION =====
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Toggle menu
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        const spans = navToggle.querySelectorAll('span');
        
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Active link on scroll
    function setActiveLink() {
        let current = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.clientHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                current = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // ===== TYPING EFFECT =====
    const typeText = document.getElementById('typeText');
    const words = ['Web Developer', 'UI Designer', 'Problem Solver', 'Tech Enthusiast'];
    let wordIdx = 0, charIdx = 0, isDeleting = false;

    function type() {
        const word = words[wordIdx];
        
        if (isDeleting) {
            typeText.textContent = word.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typeText.textContent = word.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIdx === word.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 1000);

    // ===== SCROLL REVEAL =====
    const revealItems = document.querySelectorAll('.skill-bar, .project-item, .stat-box');

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-bar')) {
                    const fill = entry.target.querySelector('.bar-fill');
                    const percent = entry.target.getAttribute('data-percent');
                    setTimeout(() => { fill.style.width = percent + '%'; }, 200);
                }
                
                // Animate counters
                if (entry.target.classList.contains('stat-box')) {
                    const num = entry.target.querySelector('.stat-num');
                    const target = parseInt(num.getAttribute('data-count'));
                    animateCount(num, target);
                }
                
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealItems.forEach(item => revealObs.observe(item));

    function animateCount(el, target, duration = 2000) {
        let current = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target + (el.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 16);
    }

    // ===== BIO TABS =====
    const bioTabs = document.querySelectorAll('.bio-tab');
    const bioPanels = document.querySelectorAll('.bio-panel');

    bioTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            
            bioTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            bioPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `panel-${target}`) {
                    panel.classList.add('active');
                }
            });
        });
    });

    // ===== PROJECT FILTER =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectItems.forEach((item, i) => {
                const cat = item.getAttribute('data-cat');
                const show = filter === 'all' || cat === filter;
                
                if (show) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, i * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    const fSubmit = document.getElementById('fSubmit');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('fName').value;
        const email = document.getElementById('fEmail').value;
        const subject = document.getElementById('fSubject').value;
        const message = document.getElementById('fMessage').value;
        
        if (!name || !email || !subject || !message) {
            showToast('Harap isi semua field!', false);
            return;
        }

        const original = fSubmit.innerHTML;
        fSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        fSubmit.disabled = true;

        setTimeout(() => {
            fSubmit.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
            contactForm.reset();
            showToast('Pesan berhasil dikirim! Terima kasih.', true);
            
            setTimeout(() => {
                fSubmit.innerHTML = original;
                fSubmit.disabled = false;
            }, 3000);
        }, 2000);
    });

    function showToast(msg, success) {
        toastMsg.textContent = msg;
        toast.querySelector('i').className = success ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        toast.style.background = success 
            ? 'linear-gradient(135deg, #10b981, #059669)' 
            : 'linear-gradient(135deg, #ef4444, #dc2626)';
        
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    // ===== SCROLL TO TOP =====
    const scrollTop = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        scrollTop.classList.toggle('show', window.scrollY > 500);
    });

    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== PARALLAX BLOBS =====
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('.blob').forEach((blob, i) => {
            blob.style.transform = `translateY(${scrolled * (i + 1) * 0.2}px)`;
        });
    });

    // ===== CONSOLE =====
    console.log('%c Portofolio Loaded ', 'background: linear-gradient(135deg,#6366f1,#ec4899);color:#fff;padding:8px 16px;border-radius:8px;font-weight:700;');
    console.log('%cDibuat dengan HTML, CSS & JavaScript murni', 'color:#64748b;');

});