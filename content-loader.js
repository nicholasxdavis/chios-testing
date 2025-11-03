/**
 * Content Loader for Client Site
 * Loads content from content.json and applies it to the page
 */

(function() {
    let siteContent = null;
    
    // Load content from JSON file
    async function loadContent() {
        try {
            const response = await fetch('content.json?' + new Date().getTime()); // Cache bust
            if (!response.ok) {
                throw new Error('Failed to load content.json');
            }
            siteContent = await response.json();
            applyContent();
        } catch (error) {
            console.error('Error loading content:', error);
            // Fallback: site will use default HTML content
        }
    }
    
    function applyContent() {
        if (!siteContent) return;
        
        // Apply site info
        if (siteContent.site) {
            // Update title
            if (siteContent.site.title) {
                document.title = siteContent.site.title;
                const titleTag = document.querySelector('title');
                if (titleTag) titleTag.textContent = siteContent.site.title;
            }
            
            // Update meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && siteContent.site.description) {
                metaDesc.setAttribute('content', siteContent.site.description);
            }
        }
        
        // Apply images
        if (siteContent.images) {
            // Logo
            document.querySelectorAll('img[src*="logo.png"]').forEach(img => {
                if (siteContent.images.logo) img.src = siteContent.images.logo;
            });
            
            // Hero image
            const heroImg = document.querySelector('img[src*="group.jpeg"]');
            if (heroImg && siteContent.images.hero) {
                heroImg.src = siteContent.images.hero;
            }
            
            // Banner
            const bannerImg = document.querySelector('img[src*="banner.png"]');
            if (bannerImg && siteContent.images.banner) {
                bannerImg.src = siteContent.images.banner;
            }
            
            // Service area
            const serviceAreaImg = document.querySelector('img[src*="servicearea.png"]');
            if (serviceAreaImg && siteContent.images.serviceArea) {
                serviceAreaImg.src = siteContent.images.serviceArea;
            }
        }
        
        // Apply hero content
        if (siteContent.content && siteContent.content.hero) {
            const hero = siteContent.content.hero;
            
            // Hero title
            const heroTitle = document.querySelector('[data-i18n="heroTitle"]');
            if (heroTitle && hero.title) {
                heroTitle.textContent = hero.title;
            }
            
            // Hero subtitle
            const heroSubtitle = document.querySelector('[data-i18n="heroSubtitle"]');
            if (heroSubtitle && hero.subtitle) {
                heroSubtitle.textContent = hero.subtitle;
            }
            
            // Hero text
            const heroText = document.querySelector('[data-i18n="heroText"]');
            if (heroText && hero.text) {
                heroText.textContent = hero.text;
            }
            
            // CTA buttons
            if (hero.cta) {
                const primaryCTA = document.querySelector('[data-i18n="getQuote"]');
                if (primaryCTA && hero.cta.primary && hero.cta.primary.text) {
                    primaryCTA.textContent = hero.cta.primary.text;
                    if (hero.cta.primary.link && primaryCTA.closest('a')) {
                        primaryCTA.closest('a').href = hero.cta.primary.link;
                    }
                }
                
                const secondaryCTA = document.querySelector('[data-i18n="ourServices"]');
                if (secondaryCTA && hero.cta.secondary && hero.cta.secondary.text) {
                    secondaryCTA.textContent = hero.cta.secondary.text;
                    if (hero.cta.secondary.link && secondaryCTA.closest('a')) {
                        secondaryCTA.closest('a').href = hero.cta.secondary.link;
                    }
                }
            }
        }
        
        // Apply contact info
        if (siteContent.content && siteContent.content.contact) {
            const contact = siteContent.content.contact;
            
            // Phone
            if (contact.phone) {
                document.querySelectorAll('a[href^="tel:"]').forEach(link => {
                    link.href = 'tel:' + contact.phone.replace(/\D/g, '');
                });
                document.querySelectorAll(':contains("(575) 520-2483")').forEach(el => {
                    if (el.textContent.includes('(575) 520-2483')) {
                        el.textContent = el.textContent.replace('(575) 520-2483', contact.phone);
                    }
                });
            }
            
            // Email
            if (contact.email) {
                document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
                    link.href = 'mailto:' + contact.email;
                });
                // Update email text
                const emailElements = document.querySelectorAll('*');
                emailElements.forEach(el => {
                    if (el.textContent && el.textContent.includes('chiosclean@gmail.com')) {
                        el.textContent = el.textContent.replace('chiosclean@gmail.com', contact.email);
                    }
                });
            }
        }
        
        // Apply styles
        if (siteContent.styles && siteContent.styles.colors) {
            const colors = siteContent.styles.colors;
            const root = document.documentElement;
            
            if (colors.primary) {
                root.style.setProperty('--primary-color', colors.primary);
            }
            if (colors.accent) {
                root.style.setProperty('--accent-color', colors.accent);
            }
            if (colors.text) {
                root.style.setProperty('--text-color', colors.text);
            }
        }
    }
    
    // Load content when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadContent);
    } else {
        loadContent();
    }
    
    // Expose for debugging
    window.siteContent = () => siteContent;
})();

