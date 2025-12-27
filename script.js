/* ============================================
   PORTFOLIO ACADEMIQUE - Groupe4
   Script JavaScript principal
   Auteur : Groupe4 - IUT-FV Bandjoun
   Version : 1.0 - Mai 2025
   ============================================ */

// ============================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio Académique Groupe4 - Chargement terminé');
    
    // Initialiser toutes les fonctionnalités
    initialiserNavigation();
    initialiserFormulaires();
    initialiserAnimations();
    initialiserAccessibilite();
    initialiserGestionModale();
    
    // Mettre à jour l'année académique dans le footer
    mettreAJourAnneeAcademique();
});

// ============================================
// GESTION DE LA NAVIGATION
// ============================================

/**
 * Initialise la navigation responsive et les interactions du menu
 */
function initialiserNavigation() {
    const menuBurger = document.querySelector('.menu-burger');
    const navPrincipale = document.querySelector('.nav-principale');
    
    // Vérifier si les éléments existent sur la page
    if (!menuBurger || !navPrincipale) return;
    
    // Gestion du clic sur le menu burger
    menuBurger.addEventListener('click', function() {
        // Basculer l'état du menu
        navPrincipale.classList.toggle('active');
        
        // Changer l'icône du burger
        const icone = this.querySelector('i');
        if (navPrincipale.classList.contains('active')) {
            icone.classList.remove('fa-bars');
            icone.classList.add('fa-times');
            menuBurger.setAttribute('aria-expanded', 'true');
        } else {
            icone.classList.remove('fa-times');
            icone.classList.add('fa-bars');
            menuBurger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Fermer le menu au clic sur un lien (mobile)
    const liensNav = document.querySelectorAll('.nav-lien');
    liensNav.forEach(lien => {
        lien.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navPrincipale.classList.remove('active');
                menuBurger.querySelector('i').classList.remove('fa-times');
                menuBurger.querySelector('i').classList.add('fa-bars');
                menuBurger.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Surligner l'élément de navigation actif
    surlignerNavigationActive();
}

/**
 * Surligne l'élément de navigation correspondant à la page courante
 */
function surlignerNavigationActive() {
    const pageCourante = window.location.pathname.split('/').pop();
    const liensNav = document.querySelectorAll('.nav-lien');
    
    liensNav.forEach(lien => {
        // Retirer la classe active de tous les liens
        lien.classList.remove('actif');
        
        // Vérifier si ce lien correspond à la page courante
        const href = lien.getAttribute('href');
        if (href === pageCourante || 
            (pageCourante === '' && href === 'index.html') ||
            (pageCourante === 'index.html' && href === 'index.html')) {
            lien.classList.add('actif');
        }
    });
}

// ============================================
// GESTION DES FORMULAIRES
// ============================================

/**
 * Initialise la validation et l'interaction des formulaires
 */
function initialiserFormulaires() {
    const formulaireContact = document.getElementById('contactForm');
    
    if (formulaireContact) {
        formulaireContact.addEventListener('submit', gererSoumissionFormulaire);
        
        // Validation en temps réel
        const champsObligatoires = formulaireContact.querySelectorAll('[required]');
        champsObligatoires.forEach(champ => {
            champ.addEventListener('blur', validerChamp);
            champ.addEventListener('input', cacherErreur);
        });
    }
}

/**
 * Valide un champ de formulaire individuel
 * @param {Event} event - Événement de validation
 */
function validerChamp(event) {
    const champ = event.target;
    const valeur = champ.value.trim();
    const idErreur = 'erreur-' + champ.name;
    const elementErreur = document.getElementById(idErreur);
    
    // Réinitialiser l'erreur
    if (elementErreur) {
        elementErreur.textContent = '';
    }
    
    // Validation spécifique selon le type de champ
    let erreur = '';
    
    if (!valeur) {
        erreur = 'Ce champ est obligatoire.';
    } else if (champ.type === 'email' && !validerEmail(valeur)) {
        erreur = 'Veuillez entrer une adresse email valide.';
    } else if (champ.id === 'message' && valeur.length < 10) {
        erreur = 'Le message doit contenir au moins 10 caractères.';
    }
    
    // Afficher l'erreur si nécessaire
    if (erreur && elementErreur) {
        elementErreur.textContent = erreur;
        champ.style.borderColor = 'var(--rouge-alerte)';
    } else {
        champ.style.borderColor = 'var(--vert-success)';
    }
}

/**
 * Cache le message d'erreur lors de la saisie
 * @param {Event} event - Événement de saisie
 */
function cacherErreur(event) {
    const champ = event.target;
    const idErreur = 'erreur-' + champ.name;
    const elementErreur = document.getElementById(idErreur);
    
    if (elementErreur) {
        elementErreur.textContent = '';
    }
    champ.style.borderColor = '';
}

/**
 * Valide une adresse email
 * @param {string} email - Adresse email à valider
 * @returns {boolean} - True si l'email est valide
 */
function validerEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Gère la soumission du formulaire de contact
 * @param {Event} event - Événement de soumission
 */
function gererSoumissionFormulaire(event) {
    event.preventDefault();
    
    const formulaire = event.target;
    const donnees = new FormData(formulaire);
    const estValide = validerFormulaireComplet(formulaire);
    
    if (!estValide) {
        afficherMessageErreur('Veuillez corriger les erreurs dans le formulaire.');
        return;
    }
    
    // Simulation d'envoi au serveur académique
    simulerEnvoiAcademique(donnees)
        .then(reponse => {
            afficherMessageSucces('Message envoyé avec succès à l\'équipe académique.');
            afficherModalConfirmation();
            formulaire.reset();
            
            // Réinitialiser les styles de validation
            const champs = formulaire.querySelectorAll('input, textarea, select');
            champs.forEach(champ => champ.style.borderColor = '');
        })
        .catch(erreur => {
            console.error('Erreur d\'envoi:', erreur);
            afficherMessageErreur('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
        });
}

/**
 * Valide l'intégralité du formulaire
 * @param {HTMLFormElement} formulaire - Formulaire à valider
 * @returns {boolean} - True si le formulaire est valide
 */
function validerFormulaireComplet(formulaire) {
    let estValide = true;
    const champsObligatoires = formulaire.querySelectorAll('[required]');
    
    champsObligatoires.forEach(champ => {
        const valeur = champ.value.trim();
        
        if (!valeur) {
            estValide = false;
            const idErreur = 'erreur-' + champ.name;
            const elementErreur = document.getElementById(idErreur);
            if (elementErreur) {
                elementErreur.textContent = 'Ce champ est obligatoire.';
            }
            champ.style.borderColor = 'var(--rouge-alerte)';
        }
    });
    
    return estValide;
}

/**
 * Simule l'envoi des données au serveur académique
 * @param {FormData} donnees - Données du formulaire
 * @returns {Promise} - Promise simulée
 */
function simulerEnvoiAcademique(donnees) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulation de succès dans 90% des cas
            if (Math.random() > 0.1) {
                resolve({
                    success: true,
                    message: 'Message reçu par le serveur académique',
                    timestamp: new Date().toISOString()
                });
            } else {
                reject(new Error('Erreur de connexion au serveur'));
            }
        }, 1500);
    });
}

// ============================================
// GESTION DES ANIMATIONS
// ============================================

/**
 * Initialise les animations au défilement
 */
function initialiserAnimations() {
    // Animation des éléments au scroll
    const elementsAAnimer = document.querySelectorAll('.reveal');
    
    if (elementsAAnimer.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elementsAAnimer.forEach(element => observer.observe(element));
    }
    
    // Animation des ondes dans le hero
    animerOndesHero();
    
    // Animation progressive du chargement
    animerChargementProgressif();
}

/**
 * Anime les ondes dans la section hero
 */
function animerOndesHero() {
    const ondes = document.querySelectorAll('.onde');
    
    ondes.forEach((onde, index) => {
        onde.style.animationDelay = `${index * 0.5}s`;
    });
}

/**
 * Anime le chargement progressif des éléments
 */
function animerChargementProgressif() {
    const elements = document.querySelectorAll('.card, .domaine-card, .membre-card');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

// ============================================
// GESTION DE LA MODALE
// ============================================

/**
 * Initialise la gestion de la modale de confirmation
 */
function initialiserGestionModale() {
    const modal = document.getElementById('confirmationModal');
    const btnFermer = document.querySelector('.modal-close');
    const btnOk = document.getElementById('modalOk');
    
    if (!modal) return;
    
    // Fermer la modale avec le bouton X
    if (btnFermer) {
        btnFermer.addEventListener('click', () => fermerModal(modal));
    }
    
    // Fermer la modale avec le bouton OK
    if (btnOk) {
        btnOk.addEventListener('click', () => fermerModal(modal));
    }
    
    // Fermer la modale en cliquant en dehors
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            fermerModal(modal);
        }
    });
    
    // Fermer la modale avec la touche Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            fermerModal(modal);
        }
    });
}

/**
 * Affiche la modale de confirmation
 */
function afficherModalConfirmation() {
    const modal = document.getElementById('confirmationModal');
    
    if (modal) {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus sur le bouton de fermeture pour accessibilité
        const btnFermer = modal.querySelector('.modal-close');
        if (btnFermer) {
            btnFermer.focus();
        }
    }
}

/**
 * Ferme la modale
 * @param {HTMLElement} modal - Élément modale à fermer
 */
function fermerModal(modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Affiche un message de succès
 * @param {string} message - Message à afficher
 */
function afficherMessageSucces(message) {
    const elementSucces = document.getElementById('success-message');
    
    if (elementSucces) {
        elementSucces.textContent = message;
        elementSucces.style.color = 'var(--vert-success)';
        
        // Masquer le message après 5 secondes
        setTimeout(() => {
            elementSucces.textContent = '';
        }, 5000);
    }
}

/**
 * Affiche un message d'erreur
 * @param {string} message - Message d'erreur à afficher
 */
function afficherMessageErreur(message) {
    // Créer un élément toast pour l'erreur
    const toast = document.createElement('div');
    toast.className = 'toast-error';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--rouge-alerte);
        color: white;
        padding: var(--espace-sm) var(--espace-md);
        border-radius: var(--radius-md);
        box-shadow: var(--ombre-forte);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Supprimer le toast après 5 secondes
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 5000);
}

/**
 * Initialise les fonctionnalités d'accessibilité
 */
function initialiserAccessibilite() {
    // Ajouter des attributs ARIA aux images
    const images = document.querySelectorAll('img[alt=""]');
    images.forEach(img => {
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', 'Image descriptive du contenu');
        }
    });
    
    // Gérer le focus pour la navigation au clavier
    gererFocusNavigation();
}

/**
 * Gère la navigation au clavier
 */
function gererFocusNavigation() {
    const liens = document.querySelectorAll('a, button, input, select, textarea');
    
    liens.forEach(lien => {
        lien.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                // Ajouter une classe pour le focus visible
                lien.classList.add('focus-visible');
                
                lien.addEventListener('blur', () => {
                    lien.classList.remove('focus-visible');
                }, { once: true });
            }
        });
    });
}

/**
 * Met à jour l'année académique dans le footer
 */
function mettreAJourAnneeAcademique() {
    const anneeElements = document.querySelectorAll('.annee-academique, .copyright');
    const anneeCourante = new Date().getFullYear();
    const anneePrecedente = anneeCourante - 1;
    const anneeAcademique = `${anneePrecedente}/${anneeCourante}`;
    
    anneeElements.forEach(element => {
        element.innerHTML = element.innerHTML.replace('2024-2025', anneeAcademique);
        element.innerHTML = element.innerHTML.replace('2025', anneeCourante.toString());
    });
}

// ============================================
// GESTION DU RESPONSIVE AVANCEE
// ============================================

/**
 * Adapte le layout en fonction de la taille d'écran
 */
function gererResponsiveAvance() {
    const largeurEcran = window.innerWidth;
    
    // Ajuster la grille des domaines techniques
    const grilleDomaines = document.querySelector('.domaines-grid');
    if (grilleDomaines) {
        if (largeurEcran <= 768) {
            grilleDomaines.style.gridTemplateColumns = '1fr';
        } else if (largeurEcran <= 1024) {
            grilleDomaines.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            grilleDomaines.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    }
    
    // Ajuster l'affichage des cartes membres
    const cartesMembres = document.querySelectorAll('.membre-card');
    if (cartesMembres.length > 0 && largeurEcran <= 768) {
        cartesMembres.forEach(carte => {
            const contenu = carte.querySelector('.membre-content');
            if (contenu) {
                contenu.style.gridTemplateColumns = '1fr';
            }
        });
    }
}

// Écouter le redimensionnement de la fenêtre
window.addEventListener('resize', gererResponsiveAvance);

// Appeler une fois au chargement
gererResponsiveAvance();

// ============================================
// ANIMATIONS CSS DYNAMIQUES
// ============================================

// Ajouter les styles d'animation pour les toasts
const styleAnimations = document.createElement('style');
styleAnimations.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .focus-visible {
        outline: 3px solid var(--bleu-tertiaire) !important;
        outline-offset: 2px !important;
    }
`;

document.head.appendChild(styleAnimations);

// ============================================
// EXPORT POUR TESTS (si nécessaire)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validerEmail,
        validerFormulaireComplet,
        simulerEnvoiAcademique
    };
}

// ============================================
// MESSAGE DE CONFIRMATION DE CHARGEMENT
// ============================================

console.log(`
╔══════════════════════════════════════════════╗
║  PORTFOLIO ACADEMIQUE GROUPEIV - IUT-FV       ║
║  Système chargé avec succès                  ║
║  Version: 1.0 | Date: ${new Date().toLocaleDateString()}      ║
╚══════════════════════════════════════════════╝
`);